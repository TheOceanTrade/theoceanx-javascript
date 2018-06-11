import request from '../utils/request'
import { getTimestamp } from '../utils/utils'

import { getConfig } from '../config/config'
import urljoin from 'url-join'
import crypto from 'crypto'

// credentials for API key user
let apiKey = null
let secret = null

// credentials for dashboard user
let username = null // currently this is email
let accessToken = null
let idToken = null
let refreshToken = null

const setDashboardUserTokens = async (_username, _accessToken, _idToken, _refreshToken) => {
  username = _username
  accessToken = _accessToken
  idToken = _idToken
  refreshToken = _refreshToken
}

const setApiKey = async (_apiKey, _secret) => {
  apiKey = _apiKey
  secret = _secret
}

const refreshTokens = async () => {
  if (!username || !refreshToken) {
    return
  }
  const response = await request({
    method: 'POST',
    url: urljoin(getConfig().api.baseURL, getConfig().api.AUTH_REFRESH),
    body: {
      userId: username,
      refreshToken: refreshToken.token
    }
  })

  if (response.body.accessToken) {
    accessToken = response.body.accessToken
    idToken = response.body.idToken
    refreshToken = response.body.refreshToken
  }
}

const getApiKeySignature = (timestamp, method, body) => {
  // create the prehash string by concatenating required parts
  const prehash = apiKey + timestamp + method + body

  // create a sha256 hmac with the secret
  const hmac = crypto.createHmac('sha256', secret)
  return hmac.update(prehash).digest('base64')
}

const setAuthHeaders = (requestProperties) => {
  if (accessToken !== null) {
    requestProperties.headers['Authorization'] = accessToken
  } else if (apiKey !== null) {
    const timestamp = getTimestamp()

    // undefined/null body is an empty object on server
    const body = requestProperties.body ? requestProperties.body : {}

    const signature = getApiKeySignature(timestamp, requestProperties.method, JSON.stringify(body))

    requestProperties.headers['TOX-ACCESS-KEY'] = apiKey
    requestProperties.headers['TOX-ACCESS-SIGN'] = signature
    requestProperties.headers['TOX-ACCESS-TIMESTAMP'] = timestamp
  }
}

const getWsAuthQuery = () => {
  if (accessToken !== null) {
    return { token: accessToken }
  } else if (apiKey !== null) {
    const timestamp = getTimestamp()

    const signature = getApiKeySignature(timestamp, 'ws', '')

    return { apiKey: apiKey, timestamp: timestamp, signature: signature }
  } else {
    return {}
  }
}

const isDashboardAuth = () => {
  return (username && accessToken && idToken && refreshToken)
}

async function authRequestWrapper (params, retries = 5) {
  setAuthHeaders(params)

  if (retries < 0) {
    throw new Error('Too many authentication retries!')
  }

  try {
    return await request(params)
  } catch (error) {
    // check to see if this is expired access token
    // if it refresh the token and try the request again
    if (error.statusCode === 401 && isDashboardAuth()) {
      await refreshTokens()

      return authRequestWrapper(params, --retries)
    } else {
      throw error
    }
  }
}

module.exports = {
  setDashboardUserTokens,
  setApiKey,
  setAuthHeaders,
  getWsAuthQuery,
  refreshTokens,
  isDashboardAuth,
  authRequestWrapper
}
