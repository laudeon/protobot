// @see the botkit documentation for more infos regarding the controller (botFactory) and bot API

'use strict'

const debug = require('debug')('protobot:botFactory')
const Botkit = require('botkit')
const middlewares = require('./middlewares')
const botFactory = Botkit.core({
  require_delivery: false
})

botFactory.middleware.ingest.use(middlewares.ingest)
botFactory.middleware.categorize.use(middlewares.categorize)
botFactory.middleware.receive.use(middlewares.recastai.receive)
botFactory.middleware.format.use(middlewares.format)

// Function called by botFactory.spawn() method
// Define the bot to let it reply using websocket
botFactory.defineBot(function socketbot (botkit, config) {
  let bot = {
    type: 'websocket',
    botkit: botkit,
    config: config || {},
    utterances: botkit.utterances,
    socket: null
  }

  // Reuses default
  // Passes context
  bot.createConversation = function (message, cb) {
    botkit.createConversation(this, message, cb)
  }

  // Reuses default
  // Passes context
  bot.startConversation = function (message, cb) {
    botkit.startConversation(this, message, cb)
  }
  
  // Send bot answer through websocket event
  bot.send = function (response, cb) {
    debug('send bot response')
    bot.socket.emit('response', response)
    cb && cb(null, response)
  }

  bot.startTyping = function () {
    bot.socket.emit('typing')
  }

  // Build bot answer
  bot.reply = function (message, response, cb) {
    if (typeof (response) === 'string') {
      response = {
        text: response
      }
    }

    response.user = 'chatbot'
    response.channel = message.channel
    response.to = message.user
    response.datetime = new Date()

    bot.say(response, cb)
  }

  // Logic to find existing convo
  // and match opened convo with incoming message
  bot.findConversation = function (message, cb) {
    for (var t = 0; t < botkit.tasks.length; t++) {
      for (var c = 0; c < botkit.tasks[t].convos.length; c++) {
        if (
            botkit.tasks[t].convos[c].isActive() &&
            botkit.tasks[t].convos[c].source_message.user === message.user
        ) {
          debug('found existing convo', botkit.tasks[t].convos[c].messages)
          return cb(botkit.tasks[t].convos[c])
        }
      }
    }
    cb(null)
  }

  return bot
})

module.exports = botFactory
