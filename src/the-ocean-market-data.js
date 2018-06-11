import api from './api'
import './utils/jsdocsModels'

export class MarketData {
  /**
   * Get the token pairs ZRX and WETH
   * @returns {Promise<TokenPair[]>} Returns the array of object token pairs
   */
  async tokenPairs () {
    return api.market.getPairs()
  }

  /**
   * To get recent activity on a given token pair
   * @param {Object} params
   * @param {String} params.baseTokenAddress The pair's base token address
   * @param {String} params.quoteTokenAddress The pair's quote token address
   * @returns {Promise<Ticker>}
   */
  async ticker (params) {
    return api.market.getTicker(params)
  }

  /**
   * To get the activity data for all the token pairs
   * @returns {Promise<TickerEntry[]>}
   */
  async tickers () {
    return api.market.getTickers()
  }

  /**
   * To get the order book with the existing orders
   * @param {Object} params
   * @param {String} params.baseTokenAddress The address of base token
   * @param {String} params.quoteTokenAddress The address of quote token
   * @param {Number} params.depth The maximum number of orders in the book
   * @returns {Promise<OrderBook>}
   */
  async orderBook (params) {
    return api.market.getOrderBook(params)
  }

  /**
   * Get a list of all past and present orders for a user
   * @param {Object} params
   * @param {String} params.baseTokenAddress The address of base token
   * @param {String} params.quoteTokenAddress The address of quote token
   * @returns {Promise<TradeHistoryItem[]>}
   */
  async tradeHistory (params) {
    return api.market.getTradeHistory(params)
  }

  /**
   * To get the candlesticks for the specific tokens, time and interval
   * @param {Object} params
   * @param {String} params.baseTokenAddress The address of base token
   * @param {String} params.quoteTokenAddress The address of quote token
   * @param {String} params.startTime The start time in unix epoch
   * @param {String} params.endTime The end time in unix epoch
   * @param {String} params.interval The interval in seconds
   * @returns {Promise<Candlestick[]>}
   */
  async candlesticks (params) {
    return api.market.getCandlesticks(params)
  }

  /**
   * To get a list of available candlesticks intervals
   * @returns {Promise<String[]>}
   */
  async candlesticksIntervals () {
    return api.market.getCandlesticksIntervals()
  }

  /**
   * Get order info
   * @param {Object} params
   * @param {String} params.orderHash The hash of order
   * @returns {Promise<OceanOrder>}
   */
  async orderInfo (params) {
    return api.market.getOrderInfo(params)
  }

  /**
   * Get fee components
   * @returns {Promise<FeeComponents>}
   */
  async feeComponents () {
    return api.market.getFeeComponents()
  }
}

export default MarketData
