// read configured E-Com Plus app data
const getAppData = require('./../../lib/store-api/get-app-data')

const SKIP_TRIGGER_NAME = 'SkipTrigger'
const ECHO_SUCCESS = 'SUCCESS'
const ECHO_SKIP = 'SKIP'
const ECHO_API_ERROR = 'STORE_API_ERR'

exports.post = ({ appSdk }, req, res) => {
  // receiving notification from Store API
  const { storeId } = req

  /**
   * Treat E-Com Plus trigger body here
   * Ref.: https://developers.e-com.plus/docs/api/#/store/triggers/
   */
  const trigger = req.body

  // get app configured options
  let auth
  return appSdk.getAuth(storeId).then(_auth => {
    auth = _auth
    /* DO YOUR CUSTOM STUFF HERE */
    if (trigger.resource === 'orders' && storeId == 1024) {
      // handle order fulfillment status changes
      const order = trigger.body
      if (
        order &&
        order.fulfillment_status &&
        order.fulfillment_status.current === 'ready_for_shipping'
      ) {
        // read full order body
        const resourceId = trigger.resource_id
        console.log('Trigger disparado para enviar tag com id:', resourceId)
        return appSdk.apiRequest(storeId, `/orders/${resourceId}.json`, 'GET', null, auth)
          .then(async ({ response }) => {
            const order = response.data
            if (order && order.shipping_lines[0] && order.shipping_lines[0].app && order.shipping_lines[0].app.carrier !== 'MANDAE') {
              return res.send(ECHO_SKIP)
            }
            const now = new Date()
            const promises = []
            promises.push(appSdk.apiRequest(
              storeId,
              `/orders/${resourceId}/fulfillments.json`,
              'POST',
              {
                "date_time": now.toISOString(),
                "status": "shipped"
              },
              auth
            ))
            promises.push(appSdk.apiRequest(
              storeId,
              `/orders/${resourceId}/shipping_lines/0.json`,
              'POST',
              {
                "tracking_codes": [
                  {
                    "tag": "mandae",
                    "code": `TIA${order.number}`,
                    "link": `https://rastreae.com.br/resultado/TIA${order.number}`
                  }
                ]
              },
              auth
            ))
            await Promise.all(promises).then(res => {
              console.log('etiqueta e status enviados corretamente para:', storeId, resourceId)
            })
            .catch(err => {
              console.log('nao foi criado status e etiqueta corretamente')
            })
          })
          .then(() => {
            // all done
            res.send(ECHO_SUCCESS)
          })
      }
    }
  })
  .catch(err => {
    if (err.name === SKIP_TRIGGER_NAME) {
      // trigger ignored by app configuration
      res.send(ECHO_SKIP)
    } else if (err.appWithoutAuth === true) {
      const msg = `Webhook for ${storeId} unhandled with no authentication found`
      const error = new Error(msg)
      error.trigger = JSON.stringify(trigger)
      console.error(error)
      res.status(412).send(msg)
    } else {
      // console.error(err)
      // request to Store API with error response
      // return error status code
      res.status(500)
      const { message } = err
      res.send({
        error: ECHO_API_ERROR,
        message
      })
    }
  })
  
}
