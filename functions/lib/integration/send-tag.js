const axios = require('axios')
const ecomUtils = require('@ecomplus/utils')
const { logger } = require('firebase-functions')

module.exports = async (order, storeId, appData, appSdk) => {
        const token = appData.mandae_token 
        const orderNumber = order.number
        const { amount } = order
        const label = order.shipping_method_label
        const { buyers: [buyer] } = order
        const { invoices: [invoice], app, to } = order.shipping_lines && order.shipping_lines.length && order.shipping_lines[0]
        const { number, serial_number, access_key } = invoice 
        const trackingCode = `TIA${number.replace(/^0+/, '')}${serial_number.replace('0', '')}`
        console.log('tracking code', trackingCode)
        if (app && app.carrier === 'MANDAE') {
            const skus = []
            const address = {
                "country": "BR"
            };
            [['postalCode', 'zip'], 
            ['street', 'street'], 
            ['number', 'number'], 
            ['neighborhood', 'borough'],
            ['addressLine2', 'complement'],
            ['city', 'city'],
            ['state', 'province_code'],
            ['reference', 'near_to']].forEach(fields => {
                    if (fields[1] === 'zip') {
                        address[fields[0]] = to[fields[1]] && to[fields[1]].replace(/\D/g, '')
                    } else if (fields[1] !== 'number') {
                        address[fields[0]] = to[fields[1]]
                    } else if (fields[1] === 'number') {
                        address[fields[0]] = to[fields[1]] ? String(to[fields[1]]) : 'SN'
                    }
            })
            const recipient = {
                "fullName": ecomUtils.fullName(buyer),
                "phone": ecomUtils.phone(buyer),
                "email": buyer.main_email,
                "document": buyer.doc_number,
                address
            }
            order.items.forEach(item => {
                skus.push({
                    "skuId": item.sku.trim(),
                    "description": item.name.trim(),
                    "price": item.final_price || item.price,
                    "quantity": item.quantity
                })
            })
            const invoice = {
                "id": number,
                "key": access_key,
                "type": "NFe"
            }
            const data = {
                "customerId": "E6A2C7449FB84AB797CB1328BF1F8952",
                "items": [
                {
                    skus,
                    invoice,
                    "trackingId": trackingCode.trim(),
                    "partnerItemId": String(orderNumber).trim(),
                    recipient,
                    "sender": {
                    "fullName": "Tia Sonia",
                    "email": "ecommerce@tiasonia.com.br",
                    "document": "08385685000739",
                    "ie": "206748880112",
                    "address": {
                        "postalCode": "06422120",
                        "street": "Avenida Gupê",
                        "number": "10767",
                        "neighborhood": "Jardim Belval",
                        "addressLine2": "Galpões 15, 24 e 25",
                        "city": "Barueri",
                        "state": "SP",
                        "country": "BR"
                    }
                },
                "shippingService": label.trim(),
                "channel": "ecommerce",
                "store": "Tia Sônia",
                "totalValue": amount.total,
                "totalFreight": amount.freight
                }
                ],
                "observation": null
            }
            console.log(JSON.stringify(data))
            await axios.post('https://api.mandae.com.br/v2/orders/add-parcel',
                data,
                    {
                headers: {
                    Authorization: token
                },
                timeout: 7000
            }).then(resultParcel => {
                console.log('criou etiqueta')
                await appSdk.apiRequest(storeId, `/orders/${order._id}/shipping_lines/0.json`, 'PATCH', {
                    tracking_codes: [{
                      code: trackingCode,
                      link: `https://rastreae.com.br/resultado/${trackingCode}`
                    }]
                })
            })
            .catch(err => console.log('nao criou', err.response.data))
        }
}