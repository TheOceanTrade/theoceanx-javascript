import { getConfig } from '../config/config'
import urljoin from 'url-join'
import { BigNumber } from 'bignumber.js'
import { getAuthToken } from '../auth/auth'

function getEndpoint (service) {
  return urljoin(getConfig().api.baseURL, service)
}

function requestProperties (method = 'GET') {
  let headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  }

  let authToken = getAuthToken()
  if (authToken) {
    headers['Authorization'] = authToken
  }

  return {
    method: method,
    json: true,
    headers: headers
  }
}
function toRequest (order) {
  order.makerFee = toRequestValue(order.makerFee)
  order.takerFee = toRequestValue(order.takerFee)
  order.makerTokenAmount = toRequestValue(order.makerTokenAmount)
  order.takerTokenAmount = toRequestValue(order.takerTokenAmount)
  order.salt = toRequestValue(order.salt)
  order.expirationUnixTimestampSec = toRequestValue(order.expirationUnixTimestampSec)
  return order
}

export function toRequestValue (value) {
  if (value instanceof BigNumber) {
    value = value.toString()
  }
  return value
}

module.exports = {
  getEndpoint,
  requestProperties,
  toRequest
}
