import { getConfig } from '../config/config'
import urljoin from 'url-join'
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
    headers: headers
  }
}

module.exports = {
  getEndpoint,
  requestProperties
}
