import request from 'request-promise-native'

import { getEndpoint, requestProperties, toRequest } from './api-utils'
import { getConfig } from '../config/config'
import { getAuthToken, refreshTokens } from '../auth/auth'

/**
 * Reserve market order
 * @param {Object} params
 * @param params.baseTokenAddress
 * @param params.quoteTokenAddress
 * @param params.side
 * @param params.orderAmount
 * @returns {Promise<*>}
 */
async function reserveMarketOrder ({baseTokenAddress, quoteTokenAddress, side, orderAmount}) {
  return authRequestWrapper({
    ...requestProperties('POST'),
    url: getEndpoint(getConfig().api.RESERVE_MARKET_ORDER),
    body: {
      baseTokenAddress,
      quoteTokenAddress,
      side,
      orderAmount
    }
  })
}

/**
 * Reserve limit order
 * @param {Object} params
 * @param params.baseTokenAddress
 * @param params.quoteTokenAddress
 * @param params.side
 * @param params.orderAmount
 * @param params.price
 * @returns {Promise<*>}
 */
async function reserveLimitOrder ({baseTokenAddress, quoteTokenAddress, side, orderAmount, price}) {
  return authRequestWrapper({
    ...requestProperties('POST'),
    url: getEndpoint(getConfig().api.RESERVE_LIMIT_ORDER),
    body: {
      baseTokenAddress,
      quoteTokenAddress,
      side,
      orderAmount,
      price
    }
  })
}

/**
 * Fill market order
 * @param {Object} params
 * @param params.signedOrder
 * @returns {Promise<*>}
 */
async function fillMarketOrder ({order}) {
  return authRequestWrapper({
    ...requestProperties('POST'),
    url: getEndpoint(getConfig().api.FILL_MARKET_ORDER),
    body: order
  })
}

/**
 * @param {Object} params
 * @param params.order
 * @returns {Promise<*>}
 */
async function fillLimitOrder ({order}) {
  return authRequestWrapper({
    ...requestProperties('POST'),
    url: getEndpoint(getConfig().api.FILL_LIMIT_ORDER),
    body: order
  })
}

/**
 *
 * @param {Object} params
 * @param params.signedOrder
 * @returns {Promise<*>}
 */
async function newOrder ({signedOrder}) {
  return authRequestWrapper({
    ...requestProperties('POST'),
    url: getEndpoint(getConfig().api.ORDER),
    body: signedOrder
  })
}

/**
 * Fill order
 * @param {Object} params
 * @param params.orderHash
 * @param params.signedOrder
 * @returns {Promise<*>}
 */
async function fillOrder ({orderHash, signedOrder}) {
  signedOrder = toRequest(signedOrder)
  return authRequestWrapper({
    ...requestProperties('POST'),
    url: `${getEndpoint(getConfig().api.ORDER)}/${orderHash}/fill`,
    body: {signedOrder}
  })
}

/**
 * Cancel order
 * @param {Object} params
 * @param params.orderHash
 * @returns {Promise<*>}
 */
async function cancelOrder ({orderHash}) {
  return authRequestWrapper({
    ...requestProperties('DELETE'),
    url: `${getEndpoint(getConfig().api.ORDER)}/${orderHash}`
  })
}

/**
 * @param {Object=} params
 * @param {string=} params.userId
 * @returns {Promise<*>}
 */
async function getUserHistory ({userId} = {userId: null}) {
  return authRequestWrapper({
    url: getEndpoint(getConfig().api.USER_HISTORY),
    ...requestProperties(),
    qs: {
      userId
    }
  })
}

async function authRequestWrapper (params, retries = 5) {
  if (retries < 0) {
    throw new Error('Too many authenticatino retries!')
  }

  try {
    return await request(params)
  } catch (error) {
    // check to see if this is expired access token
    // if it refresh the token and try the request again
    if (error.statusCode === 401 && getAuthToken()) {
      await refreshTokens()

      return authRequestWrapper(params, --retries)
    } else {
      throw error
    }
  }
}

module.exports = {
  reserveMarketOrder,
  reserveLimitOrder,
  fillMarketOrder,
  fillLimitOrder,
  newOrder,
  fillOrder,
  cancelOrder,
  getUserHistory
}
