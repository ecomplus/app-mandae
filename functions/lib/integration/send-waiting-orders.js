const { firestore } = require('firebase-admin')
const { setup } = require('@ecomplus/application-sdk')
const logger = require('firebase-functions/logger')
const getAppData = require('../store-api/get-app-data')
const exportOrder = require('./export-order')

const listStoreIds = () => {
  const storeIds = []
  const date = new Date()
  date.setHours(date.getHours() - 48)
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

const fetchWaitingOrders = async ({ appSdk, storeId }) => {
  const auth = await appSdk.getAuth(storeId)
  return new Promise((resolve, reject) => {
    getAppData({ appSdk, storeId, auth })
      .then(async (appData) => {
        resolve()
        const mandaeToken = appData.mandae_token
        const mandaeOrderSettings = appData.__order_settings
        if (mandaeToken && (mandaeOrderSettings?.data || storeId === 1024)) {
          const d = new Date()
          d.setDate(d.getDate() - 14)
          const endpoint = '/orders.json' +
            '?fields=_id,number,amount,fulfillment_status,shipping_lines' +
              ',shipping_method_label,buyers' +
              ',items.sku,items.name,items.final_price,items.price,items.quantity' +
            '&shipping_lines.app.carrier=MANDAE' +
            '&shipping_lines.tracking_codes.tag!=mandae' +
            '&financial_status.current=paid' +
            '&fulfillment_status.current=ready_for_shipping' +
            `&updated_at>=${d.toISOString()}` +
            '&sort=number' +
            '&limit=200'
          try {
            const { response } = await appSdk.apiRequest(storeId, endpoint, 'GET')
            const orders = response.data.result
            logger.info(`Start exporting orders for #${storeId}`, { orders })
            for (let i = 0; i < orders.length; i++) {
              const order = orders[i]
              try {
                await exportOrder(
                  { appSdk, storeId, auth },
                  { order, mandaeToken, mandaeOrderSettings }
                )
              } catch (error) {
                if (error.response?.data?.error?.code === '422') {
                  const err = new Error(`Failed exporting order ${order.number} for #${storeId}`)
                  logger.error(err, {
                    request: error.config,
                    response: error.response.data
                  })
                } else {
                  throw error
                }
              }
            }
          } catch (_err) {
            if (_err.response) {
              const err = new Error(`Failed exporting orders for #${storeId}`)
              logger.error(err, {
                request: _err.config,
                response: _err.response.data
              })
            } else {
              logger.error(_err)
            }
          }
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
      return Promise.all(runAllStores(fetchWaitingOrders))
    })
  })
  .catch(logger.error)
