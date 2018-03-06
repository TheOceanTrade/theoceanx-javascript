/* global jest, expect, describe, it, beforeAll  */

import { setConfig } from '../src/config/config'
import createTheOceanX from '../src/the-ocean-x'
import Web3 from 'web3'

describe('MarketData ', () => {
  beforeAll(() => {
    setConfig({
      websockets: 'localhost:3001',
      api: {
        baseURL: 'http://localhost:3000/api/v0'
      }
    })
  })

  it('warns about initialization without web3 provider and exposes only marketData & stream methods', async () => {
    console.warn = jest.fn(warn => {})
    const api = await createTheOceanX({
      api: {
        baseURL: process.env.API_URL
      }
    })
    expect(api).toBeDefined()
    expect(console.warn).toHaveBeenCalledWith('OceanX client initialized without web3 provider! Only market data methods are available.')
    expect(api.marketData).toBeDefined()
    expect(api.ws).toBeDefined()
    expect(api.wallet).toBeUndefined()
    expect(api.getWeb3Accounts).toBeUndefined()
    expect(api.setApiKeyAndSecret).toBeUndefined()
    expect(api.trade).toBeUndefined()
  })

  it('warns about initialization without authentication and hides trade methods', async () => {
    console.warn = jest.fn(warn => {})
    let web3Provider = new Web3.providers.HttpProvider('https://kovan.infura.io/XGsH1k50zyZmp6J5CwUz')
    const api = await createTheOceanX({
      web3Provider: web3Provider,
      api: {
        baseURL: process.env.API_URL
      }
    })
    expect(api).toBeDefined()
    expect(console.warn).toHaveBeenCalledWith('OceanX client initialized without authentication! Trade methods are unavailable.')
    expect(api.marketData).toBeDefined()
    expect(api.ws).toBeDefined()
    expect(api.wallet).toBeDefined()
    expect(api.getWeb3Accounts).toBeDefined()
    expect(api.setApiKeyAndSecret).toBeDefined()
    expect(api.trade).toBeUndefined()
  })
})
