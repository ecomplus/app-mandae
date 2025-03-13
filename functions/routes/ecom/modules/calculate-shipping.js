const axios = require('axios')
const ecomUtils = require('@ecomplus/utils')

const getKgWeight = (item) => {
  if (!item.weight?.value) {
    return 0.000000001 // min weight required by Mandae
  }
  const unit = item.weight.unit
  switch (unit) {
    case 'g':
      return item.weight.value / 1000
    case 'mg':
      return item.weight.value / 1000000
    default: // kg
      return item.weight.value
  }
}

const getCmDimension = (item, side) => {
  if (!item.dimensions?.[side]?.value) {
    return 0.1
  }
  const unit = item.dimensions[side].unit || 'cm'
  switch (unit) {
    case 'm':
      return item.dimensions[side].value * 100
    case 'mm':
      return item.dimensions[side].value / 10
    default: // cm
      return item.dimensions[side].value
  }
}

const checkZipCode = (destinationZip, rule) => {
  // validate rule zip range
  if (destinationZip && rule?.zip_range) {
    const { min, max } = rule.zip_range
    return Boolean((!min || destinationZip >= min) && (!max || destinationZip <= max))
  }
  return true
}

const applyShippingDiscount = ({
  destinationZip,
  itemsSubtotal,
  itemsKgWeight,
  shippingRules,
  mandaeShipping
}) => {
  let value
  if (Array.isArray(shippingRules)) {
    for (let i = 0; i < shippingRules.length; i++) {
      const rule = shippingRules[i]
      if (
        rule &&
        checkZipCode(destinationZip, rule) &&
        (rule.service === 'Todos' || rule.service === mandaeShipping.name) &&
        (!rule.min_amount || itemsSubtotal >= rule.min_amount) &&
        (!rule.max_kg_weight || itemsKgWeight >= rule.max_kg_weight)
      ) {
        if (rule.free_shipping) {
          value = 0
          break
        } else if (typeof rule.fixed === 'number' && rule.fixed) {
          if (value === undefined || value > rule.fixed) {
            value = rule.fixed
          }
          continue
        } else if (rule.discount) {
          let discountValue = rule.discount.value
          if (rule.discount.percentage || rule.discount.type === 'Percentual') {
            discountValue *= (mandaeShipping.price / 100)
          } else if (rule.discount.type === 'Percentual no subtotal') {
            discountValue *= (itemsSubtotal / 100)
          }
          if (discountValue) {
            if (value === undefined || value > mandaeShipping.price - discountValue) {
              value = mandaeShipping.price - discountValue
            }
            if (value < 0) {
              value = 0
              break
            }
          }
          continue
        }
      }
    }
  }
  return typeof value === 'number' ? value : mandaeShipping.price
}

const isDisabledService = (destinationZip, disableServices, shipping) => {
  if (Array.isArray(disableServices)) {
    for (let i = 0; i < disableServices.length; i++) {
      const rule = disableServices[i]
      if (rule && checkZipCode(destinationZip, rule) &&
        (rule.service === 'Todos' || rule.service === shipping.name)) {
        return true
      }
    }
  }
  return false
}

exports.post = ({ appSdk }, req, res) => {
  /**
   * Treat `params` and (optionally) `application` from request body to properly mount the `response`.
   * JSON Schema reference for Calculate Shipping module objects:
   * `params`: https://apx-mods.e-com.plus/api/v1/calculate_shipping/schema.json?store_id=100
   * `response`: https://apx-mods.e-com.plus/api/v1/calculate_shipping/response_schema.json?store_id=100
   *
   * Examples in published apps:
   * https://github.com/ecomplus/app-mandabem/blob/master/functions/routes/ecom/modules/calculate-shipping.js
   * https://github.com/ecomplus/app-datafrete/blob/master/functions/routes/ecom/modules/calculate-shipping.js
   * https://github.com/ecomplus/app-jadlog/blob/master/functions/routes/ecom/modules/calculate-shipping.js
   */

  const { params, application } = req.body
  // const { storeId } = req
  // setup basic required response object
  const response = {
    shipping_services: []
  }
  // merge all app options configured by merchant

  const appData = Object.assign({}, application.data, application.hidden_data)

  if (appData.free_shipping_from_value >= 0) {
    response.free_shipping_from_value = appData.free_shipping_from_value
  }
  const destinationZip = params.to ? params.to.zip.replace(/\D/g, '') : ''

  let originZip, warehouseCode
  let postingDeadline = appData.posting_deadline
  if (params.from) {
    originZip = params.from.zip
  } else if (Array.isArray(appData.warehouses) && appData.warehouses.length) {
    for (let i = 0; i < appData.warehouses.length; i++) {
      const warehouse = appData.warehouses[i]
      if (warehouse?.zip && checkZipCode(destinationZip, warehouse)) {
        const { code } = warehouse
        if (!code) continue
        if (params.items) {
          const itemNotOnWarehouse = params.items.find(({ quantity, inventory }) => {
            return inventory && Object.keys(inventory).length && !(inventory[code] >= quantity)
          })
          if (itemNotOnWarehouse) continue
        }
        originZip = warehouse.zip
        if (warehouse.posting_deadline?.days) {
          postingDeadline = warehouse.posting_deadline
        }
        warehouseCode = code
      }
    }
  }

  if (!originZip) {
    originZip = appData.zip
  }
  originZip = typeof originZip === 'string' ? originZip.replace(/\D/g, '') : ''

  // search for configured free shipping rule
  if (Array.isArray(appData.shipping_rules)) {
    for (let i = 0; i < appData.shipping_rules.length; i++) {
      const rule = appData.shipping_rules[i]
      if (rule.free_shipping && checkZipCode(destinationZip, rule)) {
        if (!rule.min_amount) {
          response.free_shipping_from_value = 0
          break
        } else if (!(response.free_shipping_from_value <= rule.min_amount)) {
          response.free_shipping_from_value = rule.min_amount
        }
      }
    }
  }

  if (!params.to) {
    // just a free shipping preview with no shipping address received
    // respond only with free shipping option
    res.send(response)
    return
  }

  if (!originZip) {
    // must have configured origin zip code to continue
    return res.status(409).send({
      error: 'CALCULATE_ERR',
      message: 'Zip code is unset on app hidden data (merchant must configure the app)'
    })
  }

  if (!params.items) {
    return res.status(400).send({
      error: 'CALCULATE_EMPTY_CART',
      message: 'Cannot calculate shipping without cart items'
    })
  }

  let mandaeItems = []
  let itemsSubtotal = 0
  let itemsKgWeight = 0
  const biggerBoxCmDimensions = { height: 0.1, width: 0.1, length: 0.1 }
  params.items.forEach((item) => {
    if (item.quantity > 0) {
      const declaredValue = ecomUtils.price(item)
      itemsSubtotal += (declaredValue * item.quantity)
      const weight = getKgWeight(item)
      itemsKgWeight += item.quantity * weight
      const mandaeItem = {
        declaredValue,
        weight,
        height: getCmDimension(item, 'height'),
        width: getCmDimension(item, 'width'),
        length: getCmDimension(item, 'length'),
        quantity: item.quantity
      }
      Object.keys(biggerBoxCmDimensions).forEach((side) => {
        if (biggerBoxCmDimensions[side] < mandaeItem[side]) {
          biggerBoxCmDimensions[side] = mandaeItem[side]
        }
      })
      mandaeItems.push(mandaeItem)
    }
  })
  if (appData.use_bigger_box) {
    mandaeItems = [{
      declaredValue: itemsSubtotal,
      weight: itemsKgWeight || 0.001,
      ...biggerBoxCmDimensions,
      quantity: 1
    }]
  }

  const mandaeToken = appData.mandae_token
  const mandaeUrl = 'https://api.mandae.com.br'

  const resource = `/v3/postalcodes/${params.to.zip}/rates`

  return axios(
    {
      url: mandaeUrl + resource,
      method: 'POST',
      data: {
        items: mandaeItems
      },
      headers: {
        Authorization: mandaeToken
      }
    }
  ).then(({ data, status }) => {
    if (status === 200) {
      for (const shipping of data.data.shippingServices) {
        if (!isDisabledService(destinationZip, appData.disable_services, shipping)) {
          let totalPrice = applyShippingDiscount({
            destinationZip,
            itemsSubtotal,
            itemsKgWeight,
            shippingRules: appData.shipping_rules,
            mandaeShipping: shipping
          })
          if (appData.additional_price && totalPrice) {
            totalPrice += appData.additional_price
          }
          if (totalPrice < 0) {
            totalPrice = 0
          }
          const discount = totalPrice === 0 ? shipping.price : shipping.price - totalPrice
          const shippingLine = {
            label: shipping.name,
            carrier: shipping.name,
            service_name: 'Mandae',
            service_code: `Mandae_${shipping.name}`,
            shipping_line: {
              price: shipping.price,
              total_price: totalPrice,
              warehouse_code: warehouseCode,
              flags: ['mandae-ws'],
              discount,
              delivery_time: {
                days: shipping.days,
                working_days: true
              },
              posting_deadline: {
                days: 3,
                ...postingDeadline
              },
              from: {
                zip: originZip
              },
              to: {
                ...params.to,
                zip: (data.data && data.data.postalCode) || params.to.zip
              }
            }
          }
          if (Array.isArray(appData.carriers)) {
            const carrier = appData.carriers.find(({ service }) => {
              return service === shipping.name || !service || service === 'Todos'
            })
            if (carrier) {
              if (carrier.carrier) {
                shippingLine.carrier = carrier.carrier
              }
              if (carrier.carrier_doc_number) {
                shippingLine.carrier_doc_number = carrier.carrier_doc_number.replace(/\D/g, '')
              }
            }
          }
          response.shipping_services.push(shippingLine)
        }
      }
      res.send(response)
    } else {
      const err = new Error('Invalid Mandae calculate response')
      err.response = { data, status }
      throw err
    }
  }).catch(error => {
    if (error && error.response) {
      return res.status(error.response.status).send({
        error: 'CALCULATE_SHIPPING_ERROR',
        message: error.response.data.error.message
      })
    }
    return res.status(409).send({
      error: 'CALCULATE_FAILED',
      message: error.message
    })
  })
}
