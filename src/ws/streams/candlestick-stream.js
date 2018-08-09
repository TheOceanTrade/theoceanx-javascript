import BaseStream from './base-stream'

const debug = require('debug')('the0cean:stream:generic-pair-stream')

export default class CandlestickStream extends BaseStream {
  constructor (io, channel) {
    super(io, channel, debug)
  }

  getChannelId (payload) {
    return this.channel + '_' + payload.baseTokenAddress + '_' + payload.quoteTokenAddress + '_' + payload.interval
  }

  subscribe (payload, callback) {
    super.subscribe(payload)
    return this._addSubscription(this.getChannelId(payload),
      this._getUnsubscriptionParams(payload),
      callback)
  }

  getSubscriptions () {
    let subs = []
    Object.keys(this.subscriptions).forEach(key => {
      const subscription = this.subscriptions[key]
      const channelId = key.split('_')
      subs.push({
        baseTokenAddress: channelId[channelId.length - 3],
        quoteTokenAddress: channelId[channelId.length - 2],
        interval: channelId[channelId.length - 1],
        unsubscribe: subscription.unsubscribe,
        resubscribe: subscription.resubscribe
      })
    })
    return subs
  }

  _getUnsubscriptionParams (payload) {
    return {
      baseTokenAddress: payload.baseTokenAddress,
      quoteTokenAddress: payload.quoteTokenAddress,
      interval: payload.interval
    }
  }
};
