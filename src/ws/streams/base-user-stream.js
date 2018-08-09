import BaseStream from './base-stream'
import map from 'lodash/map'
import {
  USER_ID_PARAM
} from './constants'

export default class BaseUserStream extends BaseStream {
  subscribe (payload, callback) {
    super.subscribe(payload)
    return this._addSubscription(
      this.channel,
      this._getUnsubscriptionParams(payload),
      callback
    )
  }

  getSubscriptions () {
    return map(this.subscriptions, (subscription, key) => ({
      [this.channel]: key,
      unsubscribe: subscription.unsubscribe,
      resubscribe: subscription.resubscribe
    }))
  }

  _getUnsubscriptionParams (payload) {
    return {
      [USER_ID_PARAM]: payload[USER_ID_PARAM]
    }
  }
};
