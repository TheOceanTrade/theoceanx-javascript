import _ from 'lodash'

const defaultConfig = {
  web3Provider: null,
  websockets: 'localhost:3001',
  api: {
    baseURL: 'http://localhost:3000/api/v0',
    ORDER: '/order',
    TOKEN_PAIRS: '/token_pairs',
    ORDER_BOOK: '/order_book',
    CANCEL_ORDER: '/cancel_order',
    RESERVE_MARKET_ORDER: '/market_order/reserve',
    PLACE_MARKET_ORDER: '/market_order/place',
    RESERVE_LIMIT_ORDER: '/limit_order/reserve',
    PLACE_LIMIT_ORDER: '/limit_order/place',
    USER_HISTORY: '/user_history',
    TICKER: '/ticker',
    TICKERS: '/tickers',
    CANDLESTICKS: '/candlesticks',
    TRADE_HISTORY: '/trade_history',
    ORDER_INFO: '/order',
    AUTH_TOKENS: '/auth/token',
    AUTH_REFRESH: '/auth/refresh',
    AVAILABLE_BALANCE: '/available_balance'
  },
  relay: {
    funnel: '0x00ba938cc0df182c25108d7bf2ee3d37bce07513',
    feeRecipient: '0x88a64b5e882e5ad851bea5e7a3c8ba7c523fecbe'
  }
}

let config = defaultConfig

function updateConfigExchange (zeroEx) {
  let c = getConfig()
  if (!_.has(c, 'relay.exchange')) {
    c.relay.exchange = zeroEx.exchange.getContractAddress()
  }
  setConfig(c)
}

const setConfig = c => {
  config = _.merge({}, defaultConfig, c)
}

const getConfig = () => config

module.exports = {
  setConfig,
  getConfig,
  updateConfigExchange
}
