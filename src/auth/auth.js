import request from '../utils/request'

import { getConfig } from '../config/config'
import urljoin from 'url-join'

let apiKey = null
let secret = null

let idToken = null
let refreshToken = null

const setApiKey = async (_apiKey, _secret) => {
  apiKey = _apiKey
  secret = _secret

  // get auth tokens
  const response = await request({
    method: 'POST',
    url: urljoin(getConfig().api.baseURL, getConfig().api.AUTH_TOKENS),
    body: {
      apiKey: apiKey,
      secret: secret
    }
  })
  if (response.accessToken) {
    idToken = response.idToken
    refreshToken = response.refreshToken
  }
}

const refreshTokens = async () => {
  if (!apiKey || !refreshToken) {
    return
  }

  const response = await request({
    method: 'POST',
    url: urljoin(getConfig().api.baseURL, getConfig().api.AUTH_REFRESH),
    body: {
      apiKey: apiKey,
      refreshToken: refreshToken.token
    }
  })

  if (response.accessToken) {
    idToken = response.idToken
    refreshToken = response.refreshToken
  }
}

const getAuthToken = () => {
  return (idToken === null) ? null : idToken.jwtToken
}

module.exports = {
  setApiKey,
  getAuthToken,
  refreshTokens
}
