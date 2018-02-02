import { ZeroEx } from '0x.js'
import Web3 from 'web3'

import MarketData from './the-ocean-x-market-data'
import Trade from './the-ocean-x-trade'
import Wallet from './the-ocean-x-wallet'
import { getConfig, setConfig, updateConfigExchange } from './config/config'
import { setApiKey } from './auth/auth'
import { zeroExConfigByNetworkId } from './utils/constans'
import { promisify } from './utils/utils'
import OceanXStreams from './ws/the-ocean-x-websockets'

async function createTheOceanX (web3Provider = null, config = {}) {
  setConfig(config)
  if (config.api && config.api.key && config.api.secret) {
    await setApiKey(config.api.key, config.api.secret)
  }

  if (web3Provider === null) {
    console.warn('OceanX client initialized without web3 provider! Only market data methods are available.')
    return {
      marketData: new MarketData(),
      stream: new OceanXStreams(getConfig().websockets)
    }
  }

  const provider = web3Provider || new Web3.providers.HttpProvider('http://localhost:8545')
  const web3 = new Web3(provider)
  if (!web3.eth.defaultAccount) {
    web3.eth.defaultAccount = web3.eth.accounts[0]
  }

  const networkId = await promisify(web3.version.getNetwork)

  const zeroExConfig = {
    networkId: parseInt(networkId),
    ...zeroExConfigByNetworkId[networkId]
  }
  const zeroEx = new ZeroEx(provider, zeroExConfig)

  updateConfigExchange(zeroEx)

  return {
    marketData: new MarketData(),
    trade: new Trade(web3, zeroEx),
    wallet: new Wallet(web3, zeroEx),
    getWeb3Accounts: async () => promisify(web3.eth.getAccounts),
    setApiKeyAndSecret: setApiKey,
    stream: new OceanXStreams(getConfig().websockets)
  }
}

// following line is left intentionally to support webpack's UMD output format
module.exports = createTheOceanX

export default createTheOceanX
