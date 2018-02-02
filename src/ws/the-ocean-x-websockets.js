/**
 * Created by gravity on 13/11/17.
 */
import io from 'socket.io-client'
import { CHANNEL, RESPONSE_CHANNEL } from './streams/constants'
import GenericPairsStream from './streams/generic-pairs-stream'
import UserHistoryStream from './streams/user-history-stream'
import { getAuthToken } from '../auth/auth'

const debug = require('debug')('the-ocean-x:stream')

let CONTROLLERS = {}

export default class OceanXStreams {
  constructor (url) {
    this.url = url
  }

  _initControllers () {
    CONTROLLERS[CHANNEL.ORDER_BOOK] = new GenericPairsStream(this.io, CHANNEL.ORDER_BOOK)
    CONTROLLERS[CHANNEL.CANDLESTICKS] = new GenericPairsStream(this.io, CHANNEL.CANDLESTICKS)
    CONTROLLERS[CHANNEL.TRADE_HISTORY] = new GenericPairsStream(this.io, CHANNEL.TRADE_HISTORY)
    CONTROLLERS[CHANNEL.USER_HISTORY] = new UserHistoryStream(this.io)
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

  /**
   * Subscribe to channel
   * @param channel
   * @param payload
   * @param callback
   */
  subscribe (channel, payload, callback) {
    if (channel === CHANNEL.USER_HISTORY) {
      CONTROLLERS[channel].subscribe(payload, callback)
    } else if (CONTROLLERS[channel]) {
      return CONTROLLERS[channel].subscribe(payload, callback)
    }
  }

  /**
   * Unsubscribe all subscriptions of the channel
   * @param channel
   */
  unsubscribe (channel) {
    if (CONTROLLERS[channel]) {
      CONTROLLERS[channel].unsubscribe(channel)
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
    this.isConnected = false
  }

  isConnected () {
    return this.isConnected
  }

  connect () {
    return new Promise((resolve, reject) => {
      this.io = io(this.url, {query: {token: getAuthToken()}})
      this.io.on('connect', () => {
        this._initControllers()
        this.io.on(RESPONSE_CHANNEL, this._messageHandler)
        this.isConnected = true
        resolve()
      })
      this.io.on('error', (error) => {
        this.isConnected = false
        reject(error)
      })
    })
  }
}
