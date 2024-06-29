const logger = require('firebase-functions/logger')
const axios = require('axios')
const ecomUtils = require('@ecomplus/utils')

module.exports = async (
  { appSdk, storeId },
  { order, mandaeToken, mandaeOrderSettings }
) => {
  const { number } = order
  const buyer = order.buyers?.[0]
  if (!buyer) return
  const shippingLine = order.shipping_lines?.find(({ app }) => app?.carrier === 'MANDAE')
  if (!shippingLine?.to) return
  const invoice = shippingLine.invoices?.[0]
  if (!invoice?.number || !invoice.serial_number || !invoice.access_key) {
    logger.warn(`Skipping #${storeId} order ${number} without invoice data`)
    return
  }
  const trackingId = (mandaeOrderSettings.tracking_prefix || '') +
    invoice.number.replace(/^0+/, '') +
    invoice.serial_number.replace(/^0+/, '')
  logger.info(`Sending #${storeId} ${number} with tracking ID ${trackingId}`)
  const { customerId, sender, channel, store } = mandaeOrderSettings.data
  const data = {
    customerId,
    items: [{
      skus: order.items.map(item => ({
        skuId: item.sku,
        description: item.name.trim(),
        price: ecomUtils.price(item),
        quantity: item.quantity
      })),
      invoice: {
        id: invoice.number,
        key: invoice.access_key,
        type: 'NFe'
      },
      trackingId,
      partnerItemId: `${number}`,
      recipient: {
        fullName: ecomUtils.fullName(buyer),
        phone: ecomUtils.phone(buyer),
        email: buyer.main_email,
        document: buyer.doc_number,
        address: {
          country: 'BR',
          postalCode: shippingLine.to.zip.replace(/\D/g, ''),
          number: shippingLine.to.number?.toString() || 'SN',
          street: shippingLine.to.street,
          neighborhood: shippingLine.to.borough,
          addressLine2: shippingLine.to.complement,
          city: shippingLine.to.city,
          state: shippingLine.to.province_code,
          reference: shippingLine.to.near_to
        }
      },
      sender,
      shippingService: order.shipping_method_label?.trim() || 'NA',
      channel,
      store,
      totalValue: order.amount.total,
      totalFreight: order.amount.freight || 0
    }],
    observation: null
  }
  await axios.post('https://api.mandae.com.br/v2/orders/add-parcel', data, {
    headers: { Authorization: mandaeToken },
    timeout: 7000
  })
  await appSdk.apiRequest(
    storeId,
    `/orders/${order._id}/shipping_lines/${shippingLine._id}.json`,
    'PATCH',
    {
      tracking_codes: [{
        tag: 'mandae',
        code: trackingId,
        link: `https://rastreae.com.br/resultado/${trackingId}`
      }]
    }
  )
}
