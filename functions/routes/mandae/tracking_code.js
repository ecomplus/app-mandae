const ecomUtils = require('@ecomplus/utils')

exports.post = async ({ appSdk, admin }, req, res) => {
  console.log('>> POST Tracking')
  const { body, query } = req
  const { trackingCode, carrierCode, events } = body
  const storeId = parseInt(query.storeId, 10)
  if (storeId > 100 && trackingCode) {
    console.log('>> Store tracking: ', storeId, trackingCode, JSON.stringify(events), '<<')
    return appSdk.getAuth(storeId)
      .then(async (auth) => {
        try {
            console.log('logado')
            const number = trackingCode.replace('TIA', '').replace('21', '')
            const ordersEndpoint = '/orders.json?fields=_id,number,fulfillment_status,shipping_lines.invoices,metafields' +
            '&shipping_lines.app.carrier=MANDAE' +
            '&fulfillment_status.current!=delivered' +
            `&shipping_lines.invoices.number=0000${number}`
            return appSdk.apiRequest(storeId, ordersEndpoint, 'GET')
              .then(({ response }) => {
                console.log('Return from request result', JSON.stringify(response.data && response.data.result))
                const order = response.data && response.data.result && response.data.result.length && response.data.result[0]
                console.log('Return from request', order)
                if (order) {
                  const metafields = order && order.metafields || []
                  console.log('Return from request', JSON.stringify(order))
                  const findMostRecentEvent = events => events.reduce((a, b) => new Date(b.date) > new Date(a.date) ? b : a);
                  const lastEvent = findMostRecentEvent(events)
                  let status

                  let indexTracking
                  if (order && order.metafields && order.metafields.length) {
                    const indexTracking = order.metafields.findIndex(({field}) => field === 'mandae:tracking')
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
                  }
                  if (lastEvent && lastEvent.id == 121) {
                    status = 'shipped'
                  } else if (lastEvent && lastEvent.id == 1) {
                    status = 'delivered'
                  }
                  if (status) {
                    return appSdk
                    .apiRequest(storeId, `/orders/${order._id}.json`, 'PATCH', {
                      "fulfillment_status": {
                        "current": status,
                        "flags": [
                          status,
                          "mandae"
                        ]
                      },
                      metafields
                    }, auth).then(async response => {
                      await appSdk.apiRequest(storeId, `/orders/${order._id}/shipping_lines/0.json`, 'PATCH', {
                        tracking_codes: [{
                          code: trackingCode,
                          link: `https://rastreae.com.br/resultado/${trackingCode}`
                        }]
                      })
                      return res.status(200).send('ok')
                    })
                  }
                }
                
                return res.send({
                  status: 400,
                  msg: 'Didnt updated'
                })
              })
              .catch(err => console.log('nao buscou pedidos', err))
        } catch (error) {
          console.error(error)
          const { response, config } = error
          let status
          if (response) {
            status = response.status
            const err = new Error(`#${storeId} Mandae Webhook error ${status}`)
            err.url = config && config.url
            err.status = status
            err.response = JSON.stringify(response.data)
            console.error(err)
          }
          if (!res.headersSent) {
            return res.sendStatus(400)
          }
        }
      })
      .catch(() => {
        console.log('Unauthorized')
        if (!res.headersSent) {
          res.sendStatus(401)
        }
      })
  } else {
    return res.send({
      status: 404,
      msg: `StoreId #${storeId} not found`
    })
  }
}