/* global jest, expect, describe, it, beforeEach, beforeAll  */

import { setConfig } from '../src/config/config'
import createTheOceanX from '../src/the-ocean-x'

describe('MarketData ', () => {

  beforeAll(() => {
    setConfig({
      websockets: 'localhost:3001',
      api: {
        baseURL: 'http://localhost:3000/api/v0'
      }
    })
  })

  it('warns about initialization without web3 provider', async () => {
    console.warn = jest.fn(warn => {})
    const api = await createTheOceanX(null, {
      api: {
        baseURL: process.env.API_URL
      }
    })
    expect(api).toBeDefined()
    expect(console.warn).toHaveBeenCalledWith('OceanX client initialized without web3 provider! Only market data methods are available.')
  })

})
