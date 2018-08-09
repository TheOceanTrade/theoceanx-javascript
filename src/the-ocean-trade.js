import api from './api'
import serializers from './utils/serializers'
import { isEthereumAddress } from './utils/utils'
import { ZeroEx } from '0x.js'
import { BigNumber } from 'bignumber.js'
import './utils/jsdocsModels'

/** A class to handle all trade functions */
export class Trade {
  /**
   * Setup web3 and zeroEx
   * @param {Web3Provider} web3 - The web3 provider instance
   * @param {ZeroEx} zeroEx - The zeroEx instance
   */
  constructor (web3, zeroEx) {
    this.web3 = web3
    this.zeroEx = zeroEx
  }

  /**
   * Signs order
   * @param {Order|SignedOrder} order The order
   * @param {String} signerAddress The ethereum address you wish to sign it with
   * @returns Promise<SignedOrder>
   */
  async _signOrder (order, signerAddress) {
    const orderHash = ZeroEx.getOrderHashHex(order)
    const signature = await this.zeroEx.signOrderHashAsync(orderHash, signerAddress)
    return Object.assign({}, order, {orderHash: orderHash, ecSignature: signature})
  }

  /**
   * Places existing market orders for the specified token to buy or sell. First
   * it gets the existing orders then it matches the cheapest ones until the amount
   * to buy or sell is reached. For instance if you want to buy 10 ZRX  at market
   * price, then this function will get all the orders that are bidding for ZRX
   * and places until your amount is reached.
   *
   * 1. Request market_order/reserve with token pair and amount
   * 2. Returns unsigned order with unique ID
   * 3. Sign the order with zeroEx
   * 4. Places the order with market_order/place with the signed order and intent ID
   * @param {Object} params
   * @param {String} params.baseTokenAddress The address of base token
   * @param {String} params.quoteTokenAddress The address of quote token
   * @param {String} params.side=('buy'|'sell') The side of the order
   * @param {String} params.orderAmount The amount of tokens to sell or buy
   * @param {String} params.feeOption=('feeInZrx'|'feeInNative') Chosen fee method
   * @param {String} [account=web3.defaultAccount] The address of the account
   * @callback {reservedCallback} onReserved The callback called when was reserved
   * @returns {Promise<NewMarketOrderResponse>}
   */
  async newMarketOrder (params, account = this.web3.eth.defaultAccount, onReserved) {
    if (!isEthereumAddress(account)) {
      throw Error(`Bad account provided (${account}) to newMarketOrder`)
    }
    const reserve = await api.trade.reserveMarketOrder({ walletAddress: account, ...params })
    if (onReserved) {
      onReserved(reserve)
    }

    const matchingOrder = Object.assign({}, reserve.unsignedMatchingOrder, {maker: account})
    const signedMatchingOrder = await this._signOrder(matchingOrder, account)
    const serializedMatchingOrder = serializers.serializeOrder(signedMatchingOrder)
    const order = {
      signedMatchingOrder: serializedMatchingOrder,
      matchingOrderID: reserve.matchingOrderID
    }
    return api.trade.placeMarketOrder({order})
  }

  /**
   * To place a side market order for any available orders at a better price, then
   * posts an order to the order book for the remaining amount
   *
   * 1. Request limit_order/reserve with token pair, amount and limitPrice
   * 2. Returns 2 unsigned orders. One is the matching order (if any)
   * and the other is the order that will go to the order book
   * 3. Sign both orders with zeroEx
   * 4. Place the orders with limit_order/place with the signed orders
   *
   * @param {Object} params
   * @param {String} params.baseTokenAddress The address of base token
   * @param {String} params.quoteTokenAddress The address of quote token
   * @param {String} params.side=('buy'|'sell') The side of the order
   * @param {String} params.orderAmount The amount of tokens to sell or buy
   * @param {String} params.feeOption=('feeInZrx'|'feeInNative') Chosen fee method
   * @param {String} [account=web3.defaultAccount] The address of the placing account
   * @callback {reservedCallback} onReserved The callback called when was reserved
   * @returns {Promise<PlaceLimitOrderNotImmediatelyPlaceableResponse|PlaceLimitOrderPartiallyImmediatelyPlaceableResponse|PlaceLimitOrderCompletelyImmediatelyPlaceableResponse>}
   */
  async newLimitOrder (params, account = this.web3.eth.defaultAccount, onReserved) {
    if (!isEthereumAddress(account)) {
      throw Error(`Bad account provided (${account}) to newLimitOrder`)
    }
    const reserve = await api.trade.reserveLimitOrder({ walletAddress: account, ...params })
    if (onReserved) {
      onReserved(reserve)
    }

    const order = {}
    if (reserve.unsignedTargetOrder && reserve.unsignedTargetOrder.error === undefined) {
      const targetOrder = Object.assign({}, reserve.unsignedTargetOrder, {maker: account})
      const signedTargetOrder = await this._signOrder(targetOrder, account)
      order.signedTargetOrder = serializers.serializeOrder(signedTargetOrder)
    }
    if (reserve.unsignedMatchingOrder) {
      const matchingOrder = Object.assign({}, reserve.unsignedMatchingOrder, {maker: account})
      const signedMatchingOrder = await this._signOrder(matchingOrder, account)
      const serializedMatchingOrder = serializers.serializeOrder(signedMatchingOrder)
      order.signedMatchingOrder = serializedMatchingOrder
      order.matchingOrderID = reserve.matchingOrderID
    }

    return api.trade.placeLimitOrder({order})
  }

  /**
   * Cancels an order
   * @param {Object} params
   * @param params.orderHash The order hash
   * @returns {Promise<OceanOrder>} the cancelled order
   */
  async cancelOrder (params) {
    return api.trade.cancelOrder(params)
  }

  /**
   * Cancels all open order. Provide token pair to limit delete to it.
   * @param {Object} params
   * @param {String} params.baseTokenAddress The address of base token
   * @param {String} params.quoteTokenAddress The address of quote token
   * @returns {Promise<OceanOrder>} the cancelled orders
   */
  async cancelAllOrders (params) {
    return api.trade.cancelAllOrders(params)
  }

  /**
   * Gets user history
   * @param {Object} params
   * @param params.userId The id of the user
   * @returns {Promise<UserHistoryItem[]>}
   */
  async userHistory (params) {
    return api.trade.getUserHistory(params)
  }

  /**
   * Gets user data
   * @returns {Promise<UserData[]>}
   */
  async userData () {
    return api.trade.userData()
  }

  /**
   * Get token available balance for user
   * @param {Object} params
   * @param {String} params.tokenAddress The hash of token
   * @param {String} params.walletAddress The hash of user
   * @returns {BigNumber}
   */
  async tokenAvailableBalance (params) {
    const response = await api.trade.getTokenAvailableBalance(params)
    if (response.availableBalance) {
      return new BigNumber(response.availableBalance)
    } else { return response }
  }

  /**
   * Get committed amounts for user
   * @param {Object} params
   * @param {String} params.tokenAddress The hash of token
   * @param {String} params.walletAddress The hash of wallet address
   * @returns {BigNumber}
   */
  async tokenCommittedAmount (params) {
    const response = await api.trade.getTokenCommittedAmount(params)
    if (response.amount) {
      return new BigNumber(response.amount)
    } else {
      return response
    }
  }
}

export default Trade
