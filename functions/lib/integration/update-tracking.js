const axios = require('axios')
const { firestore } = require('firebase-admin')
const logger = require('firebase-functions/logger')
const { setup } = require('@ecomplus/application-sdk')
const getAppData = require('../store-api/get-app-data')
const ecomUtils = require('@ecomplus/utils')

const parseStatus = (id) => {
    switch (id) {
        case '1':
            return 'delivered'
            break;
        case '101':
        case '110':
        case '31':
        case '33':
        case '118':
        case '160':
        case '122':
        case '123':
        case '124':
        case '119':
        case '120':
        case '0':
        case '121':
            return 'shipped'
            break;
    }
}

const listStoreIds = () => {
  const storeIds = [1024]
  const date = new Date()
  date.setHours(date.getHours() - 72)

  return firestore()
    .collection('ecomplus_app_auth')
    .where('updated_at', '>', firestore.Timestamp.fromDate(date))
    .get().then(querySnapshot => {
      querySnapshot.forEach(documentSnapshot => {
        const storeId = documentSnapshot.get('store_id')
        if (storeIds.indexOf(storeId) === -1) {
          storeIds.push(storeId)
        }
      })
      return storeIds
    })

}

const fetchTracking = ({ appSdk, storeId }) => {
  return new Promise((resolve, reject) => {
    getAppData({ appSdk, storeId })
      .then(async (appData) => {
        resolve()
        const token = appData.mandae_token
        console.log('get in app')
        let orders
        const ordersEndpoint = '/orders.json?fields=_id,number,fulfillment_status,shipping_lines.invoices,shipping_lines.tracking_codes,metafields' +
            '&shipping_lines.app.carrier=MANDAE' +
            '&fulfillment_status.current!=delivered' +
            '&financial_status.current=paid' +
            '&shipping_lines.invoices.serial_number=21' +
            `&created_at>=${new Date(Date.now() - 1000 * 60 * 60 * 10 * 60).toISOString()}` +
            `&sort=updated_at`
        try {
            const { response } = await appSdk.apiRequest(storeId, ordersEndpoint, 'GET')
            console.log('response result', response.data && response.data.result && response.data.result.length)
            orders = response.data.result
            if (!orders.length) return
            for (let index = 0; index < orders.length; index++) {
                const order = orders[index];
                const metafields = order.metafields || []
                const { invoices: [invoice], tracking_codes } = order.shipping_lines && order.shipping_lines.length && order.shipping_lines[0]
                const { number, serial_number } = invoice 
                const trackingCode = `TIA${number.replace(/^0+/, '')}${serial_number.replace('0', '')}`
                console.log('buscando tracking code', trackingCode)
                try {
                  const resultTracking = await axios.get(`https://api.mandae.com.br/v3/trackings/${trackingCode}`, {
                    headers: {
                        Authorization: token
                    },
                    timeout: 7000
                  })
                  
                  const tracking = resultTracking 
                      && resultTracking.data 
                      && resultTracking.data.events 
                      && resultTracking.data.events.length
                      && resultTracking.data.events[0];
                  console.log('resultado tracking', JSON.stringify(tracking || {}), JSON.stringify(resultTracking || {}))
                  if (tracking && tracking.id) {
                    const status = parseStatus(tracking.id)
  
                    let indexTracking
                    if (metafields && metafields.length) {
                      indexTracking = metafields.findIndex(({field}) => field === 'mandae:tracking')
                    }
                    const metaTracking = {
                        _id: ecomUtils.randomObjectId(),
                        field: 'mandae:tracking',
                        value: tracking.name
                    }
                    if (indexTracking > -1) {
                        metafields[indexTracking] = metaTracking
                    } else {
                        metafields.push(metaTracking)
                    }
                    await appSdk.apiRequest(storeId, `/orders/${order._id}.json`, 'PATCH', {
                      metafields
                    })
                    if (!tracking_codes) {
                      await appSdk.apiRequest(storeId, `/orders/${order._id}/shipping_lines/0.json`, 'PATCH', {
                        tracking_codes: [{
                          code: trackingCode,
                          link: `https://rastreae.com.br/resultado/${trackingCode}`
                        }]
                      })
                    }
  
                    if (
                        status &&
                        (!order.fulfillment_status || order.fulfillment_status.current !== status)
                      ) {
                        await appSdk.apiRequest(storeId, `/orders/${order._id}/fulfillments.json`, 'POST', {
                          status,
                          flags: ['mandae-tracking']
                        })
                    }
                  } else {
                    console.log('tracking without movimentation', trackingCode, order.number)
                  }
                } catch (error) {
                  console.log('nao foi possivel buscar tracking', error)
                }
            }
        } catch (err) {
            logger.error(err)
        }
      })
      .catch(reject)
  })
}

module.exports = context => setup(null, true, firestore())
  .then(async appSdk => {
    await fetchTracking({ appSdk, storeId: 1024 })
  })
  .catch(logger.error)
