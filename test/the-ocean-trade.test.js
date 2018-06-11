/* global expect, describe, it, beforeEach  */

import { Trade } from '../src/the-ocean-trade'

describe('Trade ', () => {
  let trade

  beforeEach(() => {
    trade = new Trade()
  })

  it('implements trade methods', () => {
    expect(trade.newMarketOrder).toBeDefined()
    expect(trade.newLimitOrder).toBeDefined()
    expect(trade.cancelOrder).toBeDefined()
    expect(trade.userHistory).toBeDefined()
    expect(trade.tokenAvailableBalance).toBeDefined()
    expect(trade.tokenCommittedAmount).toBeDefined()
  })
})
