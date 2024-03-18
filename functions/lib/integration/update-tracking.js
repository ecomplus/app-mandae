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
        case '31':
        case '0':
        case '121':
            return 'shipped'
            break;
    }
}

const listStoreIds = () => {
  const storeIds = [1024]
  /* const date = new Date()
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
    }) */
    return storeIds
}

const fetchTracking = ({ appSdk, storeId }) => {
  return new Promise((resolve, reject) => {
    getAppData({ appSdk, storeId })
      .then(async (appData) => {
        resolve()
        const token = appData.mandae_token
        console.log('get in app')
        let orders
        const ordersEndpoint = '/orders.json?fields=_id,number,fulfillment_status,shipping_lines.invoices' +
            '&shipping_lines.app.carrier=MANDAE' +
            '&fulfillment_status.current!=delivered' +
            '&shipping_lines.invoices.serial_number=021' +
            `&created_at>=${new Date(Date.now() - 1000 * 60 * 60 * 10 * 60).toISOString()}`
        try {
            const { response } = await appSdk.apiRequest(storeId, ordersEndpoint, 'GET')
            console.log('response result', JSON.stringify(response.data))
            orders = response.data.result
            if (!orders.length) return
            for (let index = 0; index < orders.length; index++) {
                const order = array[index];
                const { invoices: [invoice] } = order.shipping_lines && order.shipping_lines.length && order.shipping_lines[0]
                const { number, serial_number } = invoice 
                const trackingCode = `TIA${number.replace(/^0+/, '')}${serial_number.replace('0', '')}`
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
                    && resultTracking.data.events[0]

                const status = parseStatus(trackingId.id)

                const indexTracking = order?.metafields?.findIndex(({field}) => field === 'mandae:tracking')
                const metaTracking = {
                    _id: ecomUtils.randomObjectId(),
                    field: 'mandae:tracking',
                    value: tracking.name
                }
                const metafields = [
                    ...order.metafields
                ]
                if (indexTracking > -1) {
                    metafields[indexTracking] = metaTracking
                } else {
                    metafields.push(metaTracking)
                }

                if (
                    status &&
                    (!order.fulfillment_status || order.fulfillment_status.current !== status)
                  ) {
                    await appSdk.apiRequest(storeId, `/orders/${order._id}/fulfillments.json`, 'POST', {
                      status,
                      flags: ['mandae-tracking']
                    })
                    if (status === 'shipped') {
                      await appSdk.apiRequest(storeId, `/orders/${order._id}/shipping_lines/0.json`, 'PATCH', {
                        tracking_codes: [{
                          code: trackingCode,
                          link: `https://rastreae.com.br/resultado/${trackingCode}`
                        }]
                      })
                      await appSdk.apiRequest(storeId, `/orders/${order._id}.json`, 'PATCH', {
                        metafields
                      })
                    }
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
  .then(appSdk => {
    return listStoreIds().then(storeIds => {
      const runAllStores = fn => storeIds
        .sort(() => Math.random() - Math.random())
        .map(storeId => fn({ appSdk, storeId }))
      return Promise.all(runAllStores(fetchTracking))
    })
  })
  .catch(logger.error)
