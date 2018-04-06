import { getConfig } from '../config/config'
import urljoin from 'url-join'

function getEndpoint (service) {
  return urljoin(getConfig().api.baseURL, service)
}

function requestProperties (method = 'GET') {
  let headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  }

  return {
    method: method,
    headers: headers
  }
}

module.exports = {
  getEndpoint,
  requestProperties
}
