const axios = require('axios')
const { firestore } = require('firebase-admin')
const logger = require('firebase-functions/logger')
const { setup } = require('@ecomplus/application-sdk')
const getAppData = require('../store-api/get-app-data')
const ecomUtils = require('@ecomplus/utils')
const sendTag = require('./send-tag')

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
        const ordersEndpoint = '/orders.json?fields=_id,number,amount,fulfillment_status,shipping_lines,shipping_method_label,metafields,buyers,items' +
            '&shipping_lines.app.carrier=MANDAE' +
            '&fulfillment_status.current=ready_for_shipping' +
            '&financial_status.current=paid' +
            '&shipping_lines.invoices.serial_number=21' +
            `&created_at>=${new Date(Date.now() - 1000 * 60 * 60 * 1 * 60).toISOString()}` +
            `&sort=updated_at`
        try {
            const { response } = await appSdk.apiRequest(storeId, ordersEndpoint, 'GET')
            console.log('response result old tags', response.data && response.data.result && response.data.result.length)
            orders = response.data.result.slice(0,100)
            if (!orders.length) return
            for (let index = 0; index < orders.length; index++) {
                const order = orders[index];
                try {
                    await sendTag(order, 1024, appData, appSdk)
                } catch (error) {

                  console.log('nao foi criar tag antiga', order._id, error)
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
