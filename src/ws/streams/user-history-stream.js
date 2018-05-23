import BaseUserStream from './base-user-stream'
import { CHANNEL } from './constants'

const debug = require('debug')('the-ocean-x:stream:user-history')

export default class UserHistoryStream extends BaseUserStream {
  constructor (io) {
    super(io, CHANNEL.USER_HISTORY, debug)
  }
}
