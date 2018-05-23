import BaseUserStream from './base-user-stream'
import { CHANNEL } from './constants'

const debug = require('debug')('the-ocean-x:stream:user_data')

export default class UserDataStream extends BaseUserStream {
  constructor (io) {
    super(io, CHANNEL.USER_DATA, debug)
  }
}
