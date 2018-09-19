// @see the botkit documentation for more infos regarding the controller and bot API

'use strict'

const debug = require('debug')('protobot:websocket')


module.exports.vroum = botFactory => function onConnection(socket) {
  const bot = botFactory.spawn()
  bot.socket = socket
  bot.connected = true

  debug('new websocket connection')

  bot.socket.on('message', (message) => {
    debug('new socket event:', 'message')
    controller.ingest(bot, message)
  })

  // TODO check utility
  bot.socket.on('close', () => {
    debug('websocket connection closed')
    bot.connected = false
    bot.socket = null
  })

  // TODO check utility
  bot.socket.on('disconnect', () => {
    debug('websocket disconnected')
    bot.connected = false
    bot.socket = null
  })

  // TODO check utility
  bot.socket.on('error', (error) => {
    debug('socket error', error)
    bot.connected = null
    bot.socket = null
  })
}
