const { firestore } = require('firebase-admin')
const { setup } = require('@ecomplus/application-sdk')
const logger = require('firebase-functions/logger')
const getAppData = require('../store-api/get-app-data')
const importOrderStatus = require('./import-order-status')

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

const fetchUndeliveredOrders = async ({ appSdk, storeId }) => {
  const auth = await appSdk.getAuth(storeId)
  return new Promise((resolve, reject) => {
    getAppData({ appSdk, storeId, auth })
      .then(async (appData) => {
        resolve()
        let mandaeTrackingPrefix = appData.__order_settings?.tracking_prefix
        if (mandaeTrackingPrefix === undefined) {
          mandaeTrackingPrefix = storeId === 1024 ? 'TIA' : ''
        }
        const mandaeToken = appData.mandae_token
        if (mandaeToken && mandaeTrackingPrefix) {
          const d = new Date()
          d.setDate(d.getDate() - 30)
          const endpoint = '/orders.json' +
            '?fields=_id,number,fulfillment_status,shipping_lines' +
            '&shipping_lines.tracking_codes.tag=mandae' +
            '&financial_status.current=paid' +
            '&fulfillment_status.current!=delivered' +
            `&updated_at>=${d.toISOString()}` +
            '&sort=updated_at' +
            '&limit=200'
          try {
            const { response } = await appSdk.apiRequest(storeId, endpoint, 'GET')
            const orders = response.data.result
            for (let i = 0; i < orders.length; i++) {
              const order = orders[i]
              try {
                await importOrderStatus(
                  { appSdk, storeId, auth },
                  { order, mandaeToken, mandaeTrackingPrefix }
                )
              } catch (error) {
                if (
                  error.response?.data?.error?.code === '404' ||
                  (error.response?.status > 403 && error.response.status < 500)
                ) {
                  const err = new Error(`Failed importing order ${order.number} status for #${storeId}`)
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
              const err = new Error(`Failed importing orders status for #${storeId}`)
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
      return Promise.all(runAllStores(fetchUndeliveredOrders))
    })
  })
  .catch(logger.error)
