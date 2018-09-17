'use strict'

const debug = require('debug')('protobot:middlewares')

const CHANNEL = 'protobot-websocket'

module.exports = () => (bot, message, res, next) => {
  debug('ingest middleware')
  message.channel = CHANNEL

  next()
}
