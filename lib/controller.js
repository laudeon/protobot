'use strict'

const path = require('path')
const debug = require('debug')('protobot:controller')
const Botkit = require('botkit')
const middlewares = require('./middlewares')
const controller = Botkit.core({
  require_delivery: false
})

controller.middleware.ingest.use(middlewares.ingest)
controller.middleware.categorize.use(middlewares.categorize)
controller.middleware.receive.use(middlewares.recastai.receive)
controller.middleware.format.use(middlewares.format)

controller.defineBot(function socketbot (botkit, config) {
  let bot = {
    type: 'socket',
    botkit: botkit,
    config: config || {},
    utterances: botkit.utterances
  }

  bot.createConversation = function (message, cb) {
    botkit.createConversation(this, message, cb)
  }

  bot.startConversation = function (message, cb) {
    botkit.startConversation(this, message, cb)
  }

  bot.send = function (response, cb) {
    debug('send bot response')
    bot.socket.emit('response', response)
    cb && cb(null, response)
  }

  bot.startTyping = function () {
    bot.socket.emit('typing')
  }

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

module.exports = controller
