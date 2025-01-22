const logger = require('firebase-functions/logger')
const axios = require('axios')
const ecomUtils = require('@ecomplus/utils')

module.exports = async (
  { appSdk, storeId, auth },
  { order, mandaeToken, mandaeOrderSettings }
) => {
  if (!mandaeOrderSettings) {
    if (storeId === 1024) {
      mandaeOrderSettings = {
        tracking_prefix: 'TIA',
        data: {
          customerId: 'E6A2C7449FB84AB797CB1328BF1F8952',
          sender: {
            fullName: 'Tia Sonia',
            email: 'ecommerce@tiasonia.com.br',
            document: '08385685000739',
            ie: '206748880112',
            address: {
              postalCode: '06422120',
              street: 'Avenida Gupê',
              number: '10767',
              neighborhood: 'Jardim Belval',
              addressLine2: 'Galpões 15, 24 e 25',
              city: 'Barueri',
              state: 'SP',
              country: 'BR'
            }
          },
          channel: 'ecommerce',
          store: 'Tia Sônia'
        }
      }
    }
  }
  const { number } = order
  const buyer = order.buyers?.[0]
  if (!buyer) return
  const shippingLine = order.shipping_lines?.find(({ app }) => app?.carrier === 'MANDAE')
  if (!shippingLine?.to) return
  const invoice = shippingLine.invoices?.[0]
  if (!invoice?.number || !invoice.serial_number || !invoice.access_key) {
    logger.warn(`Skipping #${storeId} ${number} without invoice data`)
    return
  }
  const trackingId = (mandaeOrderSettings.tracking_prefix || '') +
    invoice.number.replace(/^0+/, '').trim() +
    invoice.serial_number.replace(/^0+/, '').trim()
  const lineTrackingCodes = shippingLine.tracking_codes || []
  const savedTrackingCode = lineTrackingCodes.find(({ code }) => {
    return code === trackingId
  })
  if (savedTrackingCode) {
    logger.warn(`Skipping #${storeId} ${number} with tracking code already set`)
    if (!savedTrackingCode.tag) {
      savedTrackingCode.tag = 'mandae'
      await appSdk.apiRequest(
        storeId,
        `/orders/${order._id}/shipping_lines/${shippingLine._id}.json`,
        'PATCH',
        { tracking_codes: lineTrackingCodes },
        auth
      )
    }
    return
  }
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
          neighborhood: shippingLine.to.borough || 'Centro',
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
  try {
    await axios.post('https://api.mandae.com.br/v2/orders/add-parcel', data, {
      headers: { Authorization: mandaeToken },
      timeout: 7000
    })
  } catch (error) {
    if (!error.response?.data?.error?.message?.endsWith(' já foi utilizado')) {
      throw error
    }
  }
  await appSdk.apiRequest(
    storeId,
    `/orders/${order._id}/shipping_lines/${shippingLine._id}.json`,
    'PATCH',
    {
      tracking_codes: [
        {
          tag: 'mandae',
          code: trackingId,
          link: `https://rastreae.com.br/resultado/${trackingId}`
        },
        ...lineTrackingCodes
      ]
    },
    auth
  )
}
