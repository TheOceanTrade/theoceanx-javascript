/* global describe expect it beforeEach */

import { getConfig, setConfig, updateConfigExchange } from './config'

describe('Config ', () => {
  beforeEach(() => {
    setConfig({})
  })

  it('should have default values', () => {
    expect(getConfig()).toEqual(
      {
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
    )
  })

  it('should overwrite default values', () => {
    setConfig({
      api: {
        baseURL: 'http://1.1.1.1:3333/api/v1'
      },
      websockets: '1.1.1.1:3331'
    })
    const config = getConfig()

    expect(config.api.baseURL).toBe('http://1.1.1.1:3333/api/v1')
    expect(config.websockets).toBe('1.1.1.1:3331')
    expect(config.api.ORDER).toBe('/order')
    expect(config.relay.exchange).toBeUndefined()
  })

  it('should set exchange address if provided', async () => {
    setConfig({
      relay: {
        exchange: '0x499d511d6bc3a1a267439645cf50d5dddc688d55'
      }
    })
    const config = getConfig()

    expect(config.api.ORDER).toBe('/order')
    expect(config.relay.exchange).toBe('0x499d511d6bc3a1a267439645cf50d5dddc688d55')
  })

  it('should update exchange address from zeroEx', async () => {
    setConfig({})
    const zeroEx = {
      exchange: {
        getContractAddress: () => '0x499d511d6bc3a1a267439645cf50d5dddc688d66'
      }
    }
    updateConfigExchange(zeroEx)

    const config = getConfig()
    expect(config.relay.exchange).toBe('0x499d511d6bc3a1a267439645cf50d5dddc688d66')
    expect(config.relay.funnel).toBe('0x00ba938cc0df182c25108d7bf2ee3d37bce07513')
    expect(config.relay.feeRecipient).toBe('0x88a64b5e882e5ad851bea5e7a3c8ba7c523fecbe')
  })
})
