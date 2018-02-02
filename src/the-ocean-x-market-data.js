import api from './api'

export class MarketData {
    /**
     * Get the token pairs ZRX and WETH
     * @return {Array} Returns the array of object token pairs, each one containing
     * the address, minimum purchase amount, maximum amount and precision
     */
  async tokenPairs () {
    return api.market.getPairs()
  }

  // TODO: TBD: how to name main params object
    /**
     * To get recent activity on a given token pair
     * @param {Object} params
     * @param params.baseTokenAddress
     * @param params.quoteTokenAddress
     * @returns {Promise<*>}
     */
  async ticker (params) {
    return api.market.getTicker(params)
  }

    /**
     * To get the activity data for all the token pairs
     * @return {Array} Array of objects with the information of the baseTokenAddress,
     * quoteTokenAddress, bid, ask, last, baseTokenVolume, quoteTokenVolume and timestamp
     */
  async tickers () {
    return api.market.getTickers()
  }

    /**
     * To get the order book with the existing orders
     * @param {Object} params
     * @param params.baseTokenAddress
     * @param params.quoteTokenAddress
     * @param params.depth
     * @returns {Promise<*>}
     */
  async orderBook (params) {
    return api.market.getOrderBook(params)
  }

    /**
     * Get a list of all past and present orders for a user
     * @param {Object} params
     * @param params.baseTokenAddress
     * @param params.quoteTokenAddress
     * @returns {Promise<*>}
     */
  async tradeHistory (params) {
    return api.market.getTradeHistory(params)
  }

    /**
     * To get the candle sticks for the specific tokens, time and interval
     * @param {Object} params
     * @param params.baseTokenAddress
     * @param params.quoteTokenAddress
     * @param params.startTime
     * @param params.endTime
     * @param params.interval
     * @returns {Promise<*>}
     */
  async candleSticks (params) {
    return api.market.getCandlesticks(params)
  }

    /**
     * Get order info
     * @param {Object} params
     * @param params.orderHash
     * @returns {Promise<*>}
     */
  async orderInfo (params) {
    return api.market.getOrderInfo(params)
  }
}

export default MarketData
