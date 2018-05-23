/* global expect, describe, it, beforeEach  */

import { setConfig } from '../src/config/config'
import { MarketData } from './../src/the-ocean-x-market-data'

describe('MarketData ', () => {
  let market

  beforeEach(() => {
    setConfig({
      websockets: 'localhost:3001',
      api: {
        baseURL: 'http://localhost:3000/api/v0'
      },
      relay: {
        exchange: '0x499d511d6bc3a1a267439645cf50d5dddc688d54',
        funnel: '0x00ba938cc0df182c25108d7bf2ee3d37bce07513',
        feeRecipient: '0x88a64b5e882e5ad851bea5e7a3c8ba7c523fecbe'
      }
    })
    market = new MarketData()
  })

  it('implements market data methods', () => {
    expect(market.tokenPairs).toBeDefined()
    expect(market.ticker).toBeDefined()
    expect(market.tickers).toBeDefined()
    expect(market.orderBook).toBeDefined()
    expect(market.tradeHistory).toBeDefined()
    expect(market.candlesticks).toBeDefined()
    expect(market.candlesticksIntervals).toBeDefined()
    expect(market.orderInfo).toBeDefined()
    expect(market.availableBalance).toBeDefined()
    expect(market.committedAmounts).toBeDefined()
    expect(market.feeComponents).toBeDefined()
  })

  // it('resolves tickers and waits for docker-containers with api-node, redis db, and localchain', async () => {
  //   const result = await market.tickers()
  //   expect(result).toBeInstanceOf(Array)
  //   expect(result.length).toEqual(7)
  // })
})
