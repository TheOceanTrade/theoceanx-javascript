/* global jest, expect, describe, it, beforeAll  */

import { setConfig } from '../src/config/config'
import createTheOcean from '../src/the-ocean'
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

  it('warns about initialization without authentication and hides trade methods', async () => {
    console.warn = jest.fn(warn => {})
    let web3Provider = new Web3.providers.HttpProvider('https://kovan.infura.io/XGsH1k50zyZmp6J5CwUz')
    const api = await createTheOcean({
      web3Provider: web3Provider,
      api: {
        baseURL: process.env.API_URL
      }
    })
    expect(api).toBeDefined()
    expect(console.warn).toHaveBeenCalledWith('Ocean client initialized without authentication! Trade methods are unavailable.')
    expect(api.marketData).toBeDefined()
    expect(api.ws).toBeDefined()
    expect(api.wallet).toBeDefined()
    expect(api.getWeb3Accounts).toBeDefined()
    expect(api.setApiKeyAndSecret).toBeDefined()
    expect(api.trade).toBeUndefined()
  })

  it('exposes trade api if API key and secret are provided', async () => {
    console.warn = jest.fn(warn => {})
    let web3Provider = new Web3.providers.HttpProvider('https://kovan.infura.io/XGsH1k50zyZmp6J5CwUz')
    const api = await createTheOcean({
      web3Provider: web3Provider,
      api: {
        baseURL: process.env.API_URL,
        key: 'apikey',
        secret: 'secret'
      }
    })
    expect(api).toBeDefined()
    expect(console.warn).not.toHaveBeenCalled()
    expect(api.marketData).toBeDefined()
    expect(api.ws).toBeDefined()
    expect(api.wallet).toBeDefined()
    expect(api.getWeb3Accounts).toBeDefined()
    expect(api.setApiKeyAndSecret).toBeDefined()
    expect(api.trade).toBeDefined()
  })

  it('exposes trade api if dashboard user tokens are provided', async () => {
    console.warn = jest.fn(warn => {})
    let web3Provider = new Web3.providers.HttpProvider('https://kovan.infura.io/XGsH1k50zyZmp6J5CwUz')
    const api = await createTheOcean({
      web3Provider: web3Provider,
      api: {
        baseURL: process.env.API_URL
      },
      dashboardAuth: {
        username: 'email@theoceanx.com',
        accessToken: 'access_token',
        idToken: 'id_token',
        refreshToken: 'refresh_token'
      }
    })
    expect(api).toBeDefined()
    expect(console.warn).not.toHaveBeenCalled()
    expect(api.marketData).toBeDefined()
    expect(api.ws).toBeDefined()
    expect(api.wallet).toBeDefined()
    expect(api.getWeb3Accounts).toBeDefined()
    expect(api.setApiKeyAndSecret).toBeDefined()
    expect(api.trade).toBeDefined()
  })
})
