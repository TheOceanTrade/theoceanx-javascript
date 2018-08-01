/**
 * Created by gravity on 13/11/17.
 */
import io from 'socket.io-client'
import { CHANNEL, RESPONSE_CHANNEL } from './streams/constants'
import GenericPairsStream from './streams/generic-pairs-stream'
import UserHistoryStream from './streams/user-history-stream'
import UserDataStream from './streams/user-data-stream'
import { getWsAuthQuery } from '../auth/auth'
import CandlestickStream from './streams/candlestick-stream'

const debug = require('debug')('the-ocean:stream')

let CONTROLLERS = {}

export default class OceanXStreams {
  constructor (url) {
    this.url = url
    this.handledErrorEvents = [
      'error',
      'connect_error'
    ]
  }

  _initControllers () {
    CONTROLLERS[CHANNEL.ORDER_BOOK] = new GenericPairsStream(this.io, CHANNEL.ORDER_BOOK)
    CONTROLLERS[CHANNEL.CANDLESTICKS] = new CandlestickStream(this.io, CHANNEL.CANDLESTICKS)
    CONTROLLERS[CHANNEL.TRADE_HISTORY] = new GenericPairsStream(this.io, CHANNEL.TRADE_HISTORY)
    CONTROLLERS[CHANNEL.USER_HISTORY] = new UserHistoryStream(this.io)
    CONTROLLERS[CHANNEL.USER_DATA] = new UserDataStream(this.io)
    CONTROLLERS[CHANNEL.TICKER_STATS] = new GenericPairsStream(this.io, CHANNEL.TICKER_STATS)
  }

  /**
   * Handler for received messages
   * @param msg
   * @private
   */
  _messageHandler (msg) {
    debug('message handler', msg)
    const channel = msg.channel
    if (CONTROLLERS[channel]) {
      CONTROLLERS[channel].handleMessage(msg)
    } else {
      debug('Not exist stream handler for channel %c', channel)
    }
  }

  _transformError (error, errorType) {
    if (errorType === 'connect_error' && error.message === 'xhr poll error') {
      const newError = new Error('The Ocean client could not connect to the websocket server.')
      newError.wsConnectionError = true
      return newError
    }

    return error
  }

  /**
   * Subscribe to channel
   * @param channel
   * @param payload
   * @param callback
   */
  subscribe (channel, payload, callback) {
    CONTROLLERS[channel].subscribe(payload, callback)
  }

  /**
   * Unsubscribe all subscriptions of the channel
   * @param channel
   */
  unsubscribe (channel) {
    if (CONTROLLERS[channel]) {
      CONTROLLERS[channel].unsubscribeAll()
    }
  }

  /**
   * Get all subscriptions
   * TODO: this class should reconstruct to a structure similar to the one that the user sent in the subscription
   * @returns {Array}
   */
  getSubscriptions () {
    let subscriptions = {}
    Object.keys(CONTROLLERS).forEach((key, index) => {
      const controllerSubs = CONTROLLERS[key].getSubscriptions()
      if (controllerSubs && controllerSubs.length > 0) {
        subscriptions[key] = controllerSubs
      }
    })
    return subscriptions
  }

  /**
   * Disconnect the socket
   */
  disconnect () {
    this.io.disconnect()
    this.connected = false
  }

  isConnected () {
    return this.connected
  }

  connect () {
    return new Promise((resolve, reject) => {
      const authQuery = getWsAuthQuery()
      this.io = io(this.url, { query: authQuery })
      this.io.on('connect', () => {
        this._initControllers()
        this.io.on(RESPONSE_CHANNEL, this._messageHandler)
        this.connected = true
        resolve()
      })
      this.handledErrorEvents.forEach(errorType => this.io.on(errorType, (error) => {
        this.connected = false
        reject(this._transformError(error, errorType))
      }))
    })
  }
}
