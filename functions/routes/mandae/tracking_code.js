exports.post = async ({ appSdk, admin }, req, res) => {
  console.log('>> POST Tracking')
  const { body, query } = req
  const { trackingCode, carrierCode, events } = body
  const storeId = parseInt(query.storeId, 10)
  if (storeId > 100 && trackingCode) {
    console.log('>> Store tracking: ', storeId, ' body: ', JSON.stringify(body), '<<')
    return appSdk.getAuth(storeId)
      .then(async (auth) => {
        try {
            console.log('logado')
            const number = trackingCode.replace('TIA', '').replace('21', '')
            return appSdk
            .apiRequest(storeId, `/orders.json?shipping_lines.app.carrier=MANDAE&shipping_lines.invoices.number=0000${number}`, 'GET', null, auth)
            .then(({ data }) => {
              console.log('Return from request', data)
              const order = data && data.result && data.result[0]
              const findMostRecentEvent = events => events.reduce((a, b) => new Date(b.date) > new Date(a.date) ? b : a);
              const lastEvent = findMostRecentEvent(events)
              let status 
              if (lastEvent && lastEvent.id == 121) {
                status = 'shipped'
              } else if (lastEvent && lastEvent.id == 1) {
                status = 'delivered'
              }
              if (status) {
                return appSdk
                .apiRequest(storeId, `orders/${order.id}.json`, 'PATCH', {
                  "fulfillment_status": {
                    "current": status,
                    "flags": [
                      status,
                      "mandae"
                    ]
                  }
                }, auth).then(response => {
                  return res.status(200).send('ok')
                })
              }
            }).catch(err => console.log('nao buscou pedidos', err))
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