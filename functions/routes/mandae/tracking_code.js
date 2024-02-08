exports.post = async ({ appSdk, admin }, req, res) => {
  console.log('>> POST Tracking')
  const { body, query } = req
  const { docNumber, trackingCode, email, invoiceKey, skus, recipient, declareValue } = body
  const storeId = parseInt(query.storeId, 10)
  console.log('>> Store: ', storeId, ' body: ', JSON.stringify(body), '<<')
  if (storeId > 100) {
    return appSdk.getAuth(storeId)
      .then(async (auth) => {
        try {
            console.log('logado')
            return res.status(200).send('ok')
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