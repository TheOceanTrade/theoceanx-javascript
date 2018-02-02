import BaseStream from './base-stream'
import {
  CHANNEL,
  USER_ID_PARAM
} from './constants'

const debug = require('debug')('the-ocean-x:stream:user-history')

export default class UserHistoryStream extends BaseStream {
  constructor (io) {
    super(io, CHANNEL.USER_HISTORY, debug)
  }

  subscribe (payload, callback) {
    super.subscribe(payload)
    return this._addSubscription(CHANNEL.USER_HISTORY,
      this._getUnsubscriptionParams(payload),
      callback)
  }

  getSubscriptions () {
    let subs = []
    Object.keys(this.subscriptions).forEach(key => {
      const subscription = this.subscriptions[key]
      subs.push({
        [CHANNEL.USER_HISTORY]: key,
        unsubscribe: subscription.unsubscribe
      })
    })
    return subs
  }

  _getUnsubscriptionParams (payload) {
    return {
      [USER_ID_PARAM]: payload[USER_ID_PARAM]
    }
  }
};
