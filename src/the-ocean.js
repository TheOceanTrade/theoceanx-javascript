import { ZeroEx } from '0x.js'
import Web3 from 'web3'

import MarketData from './the-ocean-market-data'
import Trade from './the-ocean-trade'
import Wallet from './the-ocean-wallet'
import { getConfig, setConfig, updateConfigExchange } from './config/config'
import { setApiKey, setDashboardUserTokens } from './auth/auth'
import { zeroExConfigByNetworkId } from './utils/constans'
import { promisify } from './utils/utils'
import OceanXStreams from './ws/the-ocean-websockets'

/**
 * Creates TheOcean client
 * @param {Web3Provider} [web3Provider=null] The web3 provider
 * @param {Object} [config={}] The config object
 * @returns Promise<TheOceanClient>
 */
async function createTheOcean (config = {}) {
  setConfig(config)
  const apiKeyAuth = config.api && config.api.key && config.api.secret
  const dashboardAuth = config.dashboardAuth && config.dashboardAuth.username && config.dashboardAuth.accessToken && config.dashboardAuth.idToken && config.dashboardAuth.refreshToken
  const hasAuth = apiKeyAuth || dashboardAuth
  if (apiKeyAuth) {
    await setApiKey(config.api.key, config.api.secret)
  } else if (dashboardAuth) {
    await setDashboardUserTokens(config.dashboardAuth.username, config.dashboardAuth.accessToken, config.dashboardAuth.idToken, config.dashboardAuth.refreshToken)
  } else {
    console.warn('Ocean client initialized without authentication! Trade methods are unavailable.')
  }
  if (!config.web3Provider) {
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

  const Ocean = {
    marketData: new MarketData(),
    wallet: new Wallet(web3, zeroEx),
    getWeb3Accounts,
    setApiKeyAndSecret: setApiKey,
    ws: new OceanXStreams(getConfig().websockets)
  }

  if (hasAuth) {
    Ocean.trade = new Trade(web3, zeroEx)
    Ocean.setDashboardUserTokens = setDashboardUserTokens
  }

  return Ocean
}

// following line is left intentionally to support webpack's UMD output format
module.exports = createTheOcean

export default createTheOcean
