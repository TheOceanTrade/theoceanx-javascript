import request from '../utils/request'

import { getEndpoint, requestProperties } from './api-utils'
import { getConfig } from '../config/config'
import { getAuthToken, refreshTokens } from '../auth/auth'

/**
 * To reserve market order
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
 * To reserve limit order
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
 * To place market order
 * @param {Object} params
 * @param params.order The order to place
 * @returns {Promise<*>}
 */
async function placeMarketOrder ({order}) {
  return authRequestWrapper({
    ...requestProperties('POST'),
    url: getEndpoint(getConfig().api.PLACE_MARKET_ORDER),
    body: order
  })
}

/**
 * To place limit order
 * @param {Object} params
 * @param params.order The order to place
 * @returns {Promise<*>}
 */
async function placeLimitOrder ({order}) {
  return authRequestWrapper({
    ...requestProperties('POST'),
    url: getEndpoint(getConfig().api.PLACE_LIMIT_ORDER),
    body: order
  })
}

/**
 * To cancel order
 * @param {Object} params
 * @param {String} params.orderHash The order hash
 * @returns {Promise<*>}
 */
async function cancelOrder ({orderHash}) {
  return authRequestWrapper({
    ...requestProperties('DELETE'),
    url: `${getEndpoint(getConfig().api.ORDER)}/${orderHash}`
  })
}

/**
 * To get user history
 * @param {Object=} params
 * @param {string} params.userId=null
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
  placeMarketOrder,
  placeLimitOrder,
  cancelOrder,
  getUserHistory
}
