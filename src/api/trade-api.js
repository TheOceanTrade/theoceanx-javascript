import { getEndpoint, requestProperties } from './api-utils'
import { getConfig } from '../config/config'
import { authRequestWrapper } from '../auth/auth'

/**
 * To reserve market order
 * @param {Object} params
 * @param params.baseTokenAddress
 * @param params.quoteTokenAddress
 * @param params.side
 * @param params.orderAmount
 * @param params.feeOption
 * @param params.walletAddress
 * @returns {Promise<*>}
 */
async function reserveMarketOrder ({baseTokenAddress, quoteTokenAddress, side, orderAmount, feeOption, walletAddress}) {
  return authRequestWrapper({
    ...requestProperties('POST'),
    url: getEndpoint(getConfig().api.RESERVE_MARKET_ORDER),
    body: {
      baseTokenAddress,
      quoteTokenAddress,
      side,
      orderAmount,
      feeOption,
      walletAddress
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
 * @param params.feeOption
 * @param params.walletAddress
 * @returns {Promise<*>}
 */
async function reserveLimitOrder ({baseTokenAddress, quoteTokenAddress, side, orderAmount, price, feeOption, walletAddress}) {
  return authRequestWrapper({
    ...requestProperties('POST'),
    url: getEndpoint(getConfig().api.RESERVE_LIMIT_ORDER),
    body: {
      baseTokenAddress,
      quoteTokenAddress,
      side,
      orderAmount,
      price,
      feeOption,
      walletAddress
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
 *
 * @param {Object} params
 * @param params.baseTokenAddress
 * @param params.quoteTokenAddress
 * @returns {Promise<*>}
 */
async function cancelAllOrders (params) {
  let qs = {}
  if (params && params.baseTokenAddress && params.quoteTokenAddress) {
    qs = {
      baseTokenAddress: params.baseTokenAddress,
      quoteTokenAddress: params.quoteTokenAddress
    }
  }
  return authRequestWrapper({
    ...requestProperties('DELETE'),
    url: `${getEndpoint(getConfig().api.ORDER_INFO)}`,
    qs: qs
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

/**
 * To get user data
 * @returns {Promise<*>}
 */
async function userData () {
  return authRequestWrapper({
    url: getEndpoint(getConfig().api.USER_DATA),
    ...requestProperties()
  })
}

/**
 *
 * @param {Object} params
 * @param params.tokenAddress
 * @param params.walletAddress
 * @returns {Promise<*>}
 */
async function getTokenAvailableBalance ({tokenAddress, walletAddress}) {
  return authRequestWrapper({
    ...requestProperties(),
    url: `${getEndpoint(getConfig().api.AVAILABLE_BALANCE)}`,
    qs: {
      tokenAddress,
      walletAddress
    }
  })
}

/**
 *
 * @param {Object} params
 * @param params.tokenAddress
 * @param params.walletAddress
 * @returns {Promise<*>}
 */
async function getTokenCommittedAmount ({tokenAddress, walletAddress}) {
  return authRequestWrapper({
    ...requestProperties(),
    url: `${getEndpoint(getConfig().api.COMMITTED_AMOUNT)}`,
    qs: {
      tokenAddress,
      walletAddress
    }
  })
}

module.exports = {
  getTokenAvailableBalance,
  getTokenCommittedAmount,
  reserveMarketOrder,
  reserveLimitOrder,
  placeMarketOrder,
  placeLimitOrder,
  cancelOrder,
  cancelAllOrders,
  getUserHistory,
  userData
}
