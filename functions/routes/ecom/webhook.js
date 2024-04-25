// read configured E-Com Plus app data
const getAppData = require('./../../lib/store-api/get-app-data')
const createTag = require('../../lib/integration/send-tag')

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
  console.log('trigger mandae')
  // get app configured options
  let auth
  appSdk.getAuth(storeId).then(_auth => {
    auth = _auth
    return getAppData({ appSdk, storeId, auth })
    .then(appData => {
      console.log('set trigger to send tag', trigger.resource_id)
      /* DO YOUR CUSTOM STUFF HERE */
      const { mandae_token } = appData
      // const isReturn = send_tag_status_returned && order.fulfillment_status.current === 'returned_for_exchange'
      // console.log(isReturn)
      console.log(mandae_token && trigger.resource === 'orders' && storeId == 1024)
      if (mandae_token && trigger.resource === 'orders' && storeId == 1024) {
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
            .then(({ response }) => {
              const order = response.data
              if (order && order.shipping_lines[0] && order.shipping_lines[0].app && order.shipping_lines[0].app.carrier !== 'MANDAE') {
                return res.send(ECHO_SKIP)
              }
              console.log(`Shipping tag for #${storeId} ${order._id}`)
              return createTag(order, storeId, appData, appSdk)
                .then(data => {
                  console.log('Inserir rastreio', data)
                  const tag = data
                  const shippingLine = order.shipping_lines[0]
                    if (shippingLine) {
                      const trackingCodes = shippingLine.tracking_codes || []
                      const { invoices: [invoice], app, to } = shippingLine
                      const { number, serial_number, access_key } = invoice 
                      const trackingCode = `TIA${number.replace(/^0+/, '')}${serial_number.replace('0', '')}`
                      trackingCodes.push({
                        code: trackingCode,
                        link: `https://rastreae.com.br/resultado/${trackingCode}`
                      })
                      return appSdk.apiRequest(
                        storeId,
                        `/orders/${resourceId}/shipping_lines/${shippingLine._id}.json`,
                        'PATCH',
                        { tracking_codes: trackingCodes },
                        auth
                      )
                    }
                  return null
                })

                .then(() => {
                  console.log(`>> 'hidden_metafields' do pedido ${order._id} atualizado com sucesso!`)
                  // done
                  res.send(ECHO_SUCCESS)
                })
                .catch(err => {
                  console.log('deu error após gerar', err)
                })
            })
        }
      }
    })
    .then(() => {
      // all done
      res.send(ECHO_SUCCESS)
    })
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
