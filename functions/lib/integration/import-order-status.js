const logger = require('firebase-functions/logger')
const axios = require('axios')
const exportOrder = require('./export-order')

const parseMandaeStatus = ({ id, name }) => {
  switch (id) {
    case '1':
      return 'delivered'
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
    case '66':
      return 'returned'
  }
  return null
}

module.exports = async (
  { appSdk, storeId, auth },
  { order, mandaeToken, mandaeOrderSettings }
) => {
  const { number } = order
  const shippingLine = order.shipping_lines?.find(({ app }) => app?.carrier === 'MANDAE')
  if (!shippingLine?.to) return
  const invoice = shippingLine.invoices?.[0]
  if (!invoice?.number || !invoice.serial_number || !invoice.access_key) {
    logger.warn(`Skipping #${storeId} ${number} without invoice data`)
    return
  }
  let mandaeTrackingPrefix = mandaeOrderSettings?.tracking_prefix
  if (mandaeTrackingPrefix === undefined) {
    mandaeTrackingPrefix = storeId === 1024 ? 'TIA' : ''
  }
  const trackingId = mandaeTrackingPrefix +
    invoice.number.replace(/^0+/, '') +
    invoice.serial_number.replace(/^0+/, '')
  logger.info(`Tracking #${storeId} ${number} with ID ${trackingId}`)
  const { data } = await axios.get(`https://api.mandae.com.br/v3/trackings/${trackingId}`, {
    headers: { Authorization: mandaeToken },
    timeout: 7000
  })
  const trackingResult = data?.events?.[0]
  if (!trackingResult) return
  const status = parseMandaeStatus(trackingResult)
  const lineTrackingCodes = shippingLine.tracking_codes || []
  const savedTrackingCode = lineTrackingCodes.find(({ code }) => {
    return code === trackingId
  })
  if (!savedTrackingCode && status !== 'delivered') {
    logger.info(`Re-exporting #${storeId} ${number} with ID ${trackingId}`)
    await exportOrder(
      { appSdk, storeId, auth },
      { order, mandaeToken, mandaeOrderSettings }
    )
    return
  }
  if (!status) {
    logger.warn(`No parsed fulfillment status for #${storeId} ${number}`, {
      trackingId,
      trackingResult
    })
    return
  }
  if (!lineTrackingCodes.find(({ code }) => code === trackingId)) {
    lineTrackingCodes.push({
      tag: 'mandae',
      code: trackingId,
      link: `https://rastreae.com.br/resultado/${trackingId}`
    })
    await appSdk.apiRequest(
      storeId,
      `/orders/${order._id}/shipping_lines/${shippingLine._id}.json`,
      'PATCH',
      { tracking_codes: lineTrackingCodes },
      auth
    )
  }
  if (status !== order.fulfillment_status.current) {
    await appSdk.apiRequest(
      storeId,
      `/orders/${order._id}/fulfillments.json`,
      'POST',
      {
        shipping_line_id: shippingLine._id,
        date_time: new Date().toISOString(),
        status,
        notification_code: `mandae:${trackingResult.id}:${trackingResult.name}`,
        flags: ['mandae']
      },
      auth
    )
    logger.info(`#${storeId} ${number} updated to ${status}`)
  }
}
