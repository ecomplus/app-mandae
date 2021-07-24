const axios = require('axios')


const calcWeight = (item) => {
  if (!item || !item.weight) {
    return 0
  }
  const unit = item.weight.unit
  let result
  switch (unit) {
    case 'kg':
      result = item.weight.value
      break;
    case 'g':
      result = item.weight.value / 1000
      break;
    case 'mg':
      result = item.weight.value / 1000000
    default:
      break;
  }
  return result

}

const calcDimension = (item, dimensionType) => {
  if (!item || !item.dimensions || !item.dimensions[dimensionType]) {
    return 0
  }

  const unit = item.dimensions[dimensionType].unit
  let result
  switch (unit) {
    case 'm':

      result = item.dimensions[dimensionType].value * 100

      break;

    case 'mm':
      result = item.dimensions[dimensionType].value / 10
      break;
    case 'cm':
      result = item.dimensions[dimensionType].value
    default:
      break;
  }
  return result
}

const checkZipCode = (destinationZip, rule) => {
  // validate rule zip range
  if (destinationZip && rule.zip_range) {
    const { min, max } = rule.zip_range
    return Boolean((!min || destinationZip >= min) && (!max || destinationZip <= max))
  }
  return true
}

const applyShippingDiscount = (destinationZip, totalItems, shippingRules, shipping) => {
  let value = shipping.price

  if (Array.isArray(shippingRules)) {
    for (let i = 0; i < shippingRules.length; i++) {
      const rule = shippingRules[i]
      console.log('[applyShippingDiscount]', shipping, rule)
      if (
        rule
        && checkZipCode(destinationZip, rule)
        && (rule.service === 'Todos' || rule.service === shipping.name)
        && totalItems >= rule.min_amount
      ) {
        if (rule.free_shipping) {
          value = 0
          break
        } else if (rule.discount) {
          let discountValue = rule.discount.value
          if (rule.discount.percentage) {
            discountValue *= (value / 100)
          }
          if (discountValue) {
            value -= discountValue
            if (value < 0) {
              value = 0
            }
          }
          break
        }
      }
    }
  }
  return value
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
  const { storeId } = req
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

  const originZip = params.from ? params.from.zip.replace(/\D/g, '')
    : appData.zip ? appData.zip.replace(/\D/g, '') : ''

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

  const items = []
  let totalItems = 0

  for (const item of params.items) {
    totalItems += item.price
    items.push(
      {
        declaredValue: item.price,
        weight: calcWeight(item),
        height: calcDimension(item, 'height'),
        width: calcDimension(item, 'width'),
        length: calcDimension(item, 'length'),
        quantity: item.quantity
      }
    )

  }
  const mandaeToken = appData.mandae_token
  const mandaeUrl = 'https://api.mandae.com.br'

  const resource = `/v3/postalcodes/${params.to.zip}/rates`

  return axios(
    {
      url: mandaeUrl + resource,
      method: 'POST',
      data: {
        items
      },
      headers: {
        Authorization: mandaeToken
      }
    }
  ).then(({ data, status }) => {
    if (status === 200) {
      for (shipping of data.data.shippingServices) {
        console.log("[shipping]", shipping)
        const totalPrice = applyShippingDiscount(destinationZip, totalItems, appData.shipping_rules, shipping)
        const discount = shipping.price - totalPrice
        response.shipping_services.push({
          label: shipping.name,
          carrier: shipping.name,
          service_name: 'Mandae',
          shipping_line: {
            price: shipping.price,
            total_price: totalPrice,
            discount: discount,
            delivery_time: {
              days: shipping.days,
              working_days: true
            },
            from: {
              zip: originZip
            },
            to: {
              zip: data.data ? data.data.postalCode : params.to.zip
            }
          },
          flags: ['mandae-ws']
        })
      }
      res.send(response)
      return
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

  /* DO THE STUFF HERE TO FILL RESPONSE OBJECT WITH SHIPPING SERVICES */

  /**
   * Sample snippets:

  if (params.items) {
    let totalWeight = 0
    params.items.forEach(item => {
      // treat items to ship
      totalWeight += item.quantity * item.weight.value
    })
  }

  // add new shipping service option
  response.shipping_services.push({
    label: appData.label || 'My shipping method',
    carrier: 'My carrier',
    shipping_line: {
      from: appData.from,
      to: params.to,
      package: {
        weight: {
          value: totalWeight
        }
      },
      price: 10,
      delivery_time: {
        days: 3,
        working_days: true
      }
    }
  })

  */
}
