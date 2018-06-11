import request from '../utils/request'
import { Assert } from '../utils/asserts'
import { getEndpoint, requestProperties } from './api-utils'
import { getConfig } from '../config/config'

/**
 *
 * @returns {Promise<*>}
 */
async function getPairs () {
  return request({
    url: getEndpoint(getConfig().api.TOKEN_PAIRS),
    ...requestProperties()
  })
}

/**
 *
 * @param {Object} params
 * @param params.baseTokenAddress
 * @param params.quoteTokenAddress
 * @returns {Promise<*>}
 */
async function getTicker ({baseTokenAddress, quoteTokenAddress}) {
  return request({
    ...requestProperties(),
    url: getEndpoint(getConfig().api.TICKER),
    qs: {
      baseTokenAddress,
      quoteTokenAddress
    }
  })
}

/**
 *
 * @returns {Promise<*>}
 */
async function getTickers () {
  return request({
    ...requestProperties(),
    url: getEndpoint(getConfig().api.TICKERS)
  })
}

/**
 *
 * @param {Object} params
 * @param params.baseTokenAddress
 * @param params.quoteTokenAddress
 * @param params.depth
 * @returns {Promise<*>}
 */
async function getOrderBook ({baseTokenAddress, quoteTokenAddress, depth}) {
  if (!Assert.isString(baseTokenAddress) || !Assert.isString(quoteTokenAddress)) {
    throw new Error(`Expected values: 2 token names of type string, actual: ${baseTokenAddress} , ${quoteTokenAddress}`)
  }

  return request({
    ...requestProperties(),
    url: getEndpoint(getConfig().api.ORDER_BOOK),
    qs: {
      baseTokenAddress,
      quoteTokenAddress,
      depth
    }
  })
}

/**
 *
 * @param {Object} params
 * @param params.baseTokenAddress
 * @param params.quoteTokenAddress
 * @returns {Promise<*>}
 */
async function getTradeHistory ({baseTokenAddress, quoteTokenAddress}) {
  return request({
    ...requestProperties(),
    url: getEndpoint(getConfig().api.TRADE_HISTORY),
    qs: {
      baseTokenAddress,
      quoteTokenAddress
    }
  })
}

/**
 *
 * @param {Object} params
 * @param params.baseTokenAddress
 * @param params.quoteTokenAddress
 * @param params.startTime
 * @param params.endTime
 * @param params.interval
 * @returns {Promise<*>}
 */
async function getCandlesticks ({baseTokenAddress, quoteTokenAddress, startTime, endTime, interval}) {
  return request({
    ...requestProperties(),
    url: getEndpoint(getConfig().api.CANDLESTICKS),
    qs: {
      baseTokenAddress,
      quoteTokenAddress,
      startTime,
      endTime,
      interval
    }
  })
}

/**
 *
 * @returns {Promise<*>}
 */
async function getCandlesticksIntervals () {
  return request({
    ...requestProperties(),
    url: getEndpoint(getConfig().api.CANDLESTICKS_INTERVALS)
  })
}

/**
 *
 * @param {Object} params
 * @param params.orderHash
 * @returns {Promise<*>}
 */
async function getOrderInfo ({orderHash}) {
  return request({
    ...requestProperties(),
    url: `${getEndpoint(getConfig().api.ORDER_INFO)}/${orderHash}`
  })
}

/**
 *
 * @returns {Promise<*>}
 */
async function getFeeComponents () {
  return request({
    ...requestProperties(),
    url: getEndpoint(getConfig().api.FEE_COMPONENTS)
  })
}

module.exports = {
  getPairs,
  getTicker,
  getTickers,
  getOrderBook,
  getTradeHistory,
  getCandlesticks,
  getCandlesticksIntervals,
  getOrderInfo,
  getFeeComponents
}
