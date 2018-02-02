import api from './api'
import serializers from './utils/serializers'
import { BigNumber } from 'bignumber.js'
import { ZeroEx } from '0x.js'
import { getConfig } from './config/config'
import _ from 'lodash'

export class Trade {
  constructor (web3, zeroEx) {
    this.web3 = web3
    this.zeroEx = zeroEx
  }

  /**
   * Fills existing market orders for the specified token to buy or sell. First
   * it gets the existing orders then it matches the cheapest ones until the amount
   * to buy or sell is reached. For instance if you want to buy 10 ZRX  at market
   * price, then this function will get all the orders that are bidding for ZRX
   * and fill until your amount is reached.
   *
   * 1. Request market/reserve with token pair and amount
   * 2. Returns unsigned order with unique ID
   * 3. Sign the order with zeroEx
   * 4. Fill the order with market/fill with the signed order and intent ID
   * @param {Object} params
   * @param params.baseTokenAddress
   * @param params.quoteTokenAddress
   * @param params.side
   * @param params.orderAmount
   * @param [account=web3 default account]
   * @returns {Promise<*>}
   */
  async newMarketOrder (params, account = this.web3.eth.defaultAccount) {
    const reserve = await api.trade.reserveMarketOrder(params)
    // console.log(reserve) //TODO: this result is suspiciously rich object

    const marketOrder = Object.assign({}, reserve.unsignedOrder, {maker: account})
    const signedMarketOrder = await this._signOrder(marketOrder, account)
    const serializedMarketOrder = serializers.serializeOrder(signedMarketOrder)
    const order = {
      signedOrder: serializedMarketOrder,
      marketOrderID: reserve.marketOrderID
    }
    return api.trade.fillMarketOrder({order})
  }

  /**
   * To place a side market order for any available orders at a better price, then
   * posts an order to the order book for the remaining amount
   *
   * 1. Request limit/reserve with token pair, amount and limitPrice
   * 2. Returns 2 unsigned orders with unique limiOrderID. One is the matching order (if any)
   * and the other is the order that will go to the order book
   * 3. Sign both orders with zeroEx
   * 4. Fill the orders with market/submit with the signed orders and limitOrderID
   *
   * @param {Object} params
   * @param params.baseTokenAddress
   * @param params.quoteTokenAddress
   * @param params.side
   * @param params.orderAmount
   * @param [account=web3 default account]
   * @returns {Promise<void>}
   */
  async newLimitOrder (params, account = this.web3.eth.defaultAccount) {
    const reserve = await api.trade.reserveLimitOrder(params)
    const order = {}
    if (reserve.unsignedTargetOrder) {
      const targetOrder = Object.assign({}, reserve.unsignedTargetOrder, {maker: account})
      const signedTargetOrder = await this._signOrder(targetOrder, account)
      order.signedTargetOrder = serializers.serializeOrder(signedTargetOrder)
    }
    if (reserve.unsignedMarketOrder) {
      const marketOrder = Object.assign({}, reserve.unsignedMarketOrder, {maker: account})
      const signedMarketOrder = await this._signOrder(marketOrder, account)
      const serializedMarketOrder = serializers.serializeOrder(signedMarketOrder)
      order.signedMarketOrder = serializedMarketOrder
      order.marketOrderID = reserve.marketOrderID
    }

    return api.trade.fillLimitOrder({order})
  }

  /**
   * To fill an existing order
   * @param {Object} params
   * @param params.orderHash
   * @param [account=web3 default account]
   * @returns {Promise<*>}
   */
  async fillOrder (params, account = this.web3.eth.defaultAccount) {
    let orderHash = params.orderHash
    // TODO in the future we should have orders stored locally
    let order = await api.market.getOrderInfo({orderHash})
    const data = {
      makerTokenAddress: order.takerTokenAddress,
      takerTokenAddress: order.makerTokenAddress,
      makerTokenAmount: order.takerTokenAmount,
      takerTokenAmount: order.makerTokenAmount
    }
    const signedOrder = await this._getSignedOrder(data, account)
    return api.trade.fillOrder({orderHash, signedOrder})
  }

  /**
   *
   * @param {Object} params
   * @param params.orderHash
   * @returns {Promise<*>}
   */
  async cancelOrder (params) {
    return api.trade.cancelOrder(params)
  }

  /**
   *
   * @param {Object} params
   * @param params.userId
   * @returns {Promise<*>}
   */
  async userHistory (params) {
    return api.trade.getUserHistory(params)
  }

  /**
   *
   * @param {Object} params
   * @param params.baseTokenAddress
   * @param params.quoteTokenAddress
   * @param params.side
   * @param params.orderAmount
   * @param params.price
   * @param params.timeInForce
   * @param account
   * @returns {Promise<*>}
   */
  async newOrder (params, account = this.web3.eth.defaultAccount) {
    let {baseTokenAddress, quoteTokenAddress, side, orderAmount, price, timeInForce} = params
    orderAmount = new BigNumber(orderAmount)
    let data = {}
    data.expirationUnixTimestampSec = new BigNumber(parseInt(Date.now() / 1000) + timeInForce)
    if (side === 'buy') {
      data.makerTokenAddress = quoteTokenAddress
      data.takerTokenAddress = baseTokenAddress
      data.makerTokenAmount = orderAmount.times(price).toString()
      data.takerTokenAmount = orderAmount.toString()
    } else if (side === 'sell') {
      data.makerTokenAddress = baseTokenAddress
      data.takerTokenAddress = quoteTokenAddress
      data.makerTokenAmount = orderAmount.toString()
      data.takerTokenAmount = orderAmount.times(price).toString()
    }
    const signedOrder = await this._getSignedOrder(data, account)

    await api.trade.newOrder({signedOrder})
    return signedOrder.orderHash
  }

  async _getSignedOrder (data, account) {
    const defaultValues =
      {
        maker: account,
        taker: getConfig().relay.funnel,
        feeRecipient: getConfig().relay.feeRecipient,
        exchangeContractAddress: getConfig().relay.exchange,
        salt: ZeroEx.generatePseudoRandomSalt().toFixed(),
        makerFee: new BigNumber(0),
        takerFee: new BigNumber(0),
        expirationUnixTimestampSec: new BigNumber(parseInt(Date.now() / 1000) + 3600)  // one hour from now
      }
    const unsignedOrder = _.merge({}, defaultValues, data)
    return this._signOrder(unsignedOrder, account)
  }

  async _signOrder (order, etherAddress) {
    const hash = ZeroEx.getOrderHashHex(order)
    const signature = await this.zeroEx.signOrderHashAsync(hash, etherAddress)
    return Object.assign({}, order, {orderHash: hash, ecSignature: signature})
  }
}

export default Trade
