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

/**
 * Creates TheOceanX client
 * @param {Web3Provider} [web3Provider=null] The web3 provider
 * @param {Object} [config={}] The config object
 * @returns Promise<TheOceanXClient>
 */
async function createTheOceanX (config = {}) {
  setConfig(config)
  const hasAuth = config.api && config.api.key && config.api.secret
  if (hasAuth) {
    await setApiKey(config.api.key, config.api.secret)
  } else {
    console.warn('OceanX client initialized without authentication! Trade methods are unavailable.')
  }
  if (!config.web3Provider) {
    console.warn('OceanX client initialized without web3 provider! Only market data methods are available.')
    return {
      marketData: new MarketData(),
      ws: new OceanXStreams(getConfig().websockets)
    }
  }

  const provider = config.web3Provider
  const web3 = new Web3(provider)
  const getWeb3Accounts = () => promisify(web3.eth.getAccounts)
  if (!web3.eth.defaultAccount) {
    web3.eth.defaultAccount = (await getWeb3Accounts())[0]
  }

  const networkId = await promisify(web3.version.getNetwork)

  const zeroExConfig = {
    networkId: parseInt(networkId),
    ...zeroExConfigByNetworkId[networkId]
  }
  const zeroEx = new ZeroEx(provider, zeroExConfig)

  updateConfigExchange(zeroEx)

  const OceanX = {
    marketData: new MarketData(),
    wallet: new Wallet(web3, zeroEx),
    getWeb3Accounts,
    setApiKeyAndSecret: setApiKey,
    ws: new OceanXStreams(getConfig().websockets)
  }

  if (hasAuth) {
    OceanX.trade = new Trade(web3, zeroEx)
  }

  return OceanX
}

// following line is left intentionally to support webpack's UMD output format
module.exports = createTheOceanX

export default createTheOceanX
