// @see the botkit documentation for more infos regarding the controller and bot API

'use strict'

const debug = require('debug')('protobot:chatbot')
const intents = require('./intents')
const responses = require('./responses')

// Init the chatbot logic (listening to what, convo, answers...)
module.exports.vroum = (botFactory, recastaiMiddleware) => {
  botFactory.hears(['greetings'], 'message_received', recastaiMiddleware.hears, function (bot, message) {
    debug('greetings received', message)
    bot.reply(message, responses.getResponse('greetings'))
  })

  botFactory.hears(['goodbye'], 'message_received', recastaiMiddleware.hears, function (bot, message) {
    debug('goodbye received', message)
    bot.reply(message, responses.getResponse('goodbye'))
  })

  botFactory.hears(['say-thanks'], 'message_received', recastaiMiddleware.hears, function (bot, message) {
    debug('thanks received', message)
    bot.reply(message, responses.getResponse('thanks'))
  })

  botFactory.hears(['get-weather'], 'message_received', recastaiMiddleware.hears, function (bot, message) {
    intents.weather.vroum(bot, message)
  })

  botFactory.hears('(.*)', 'message_received', function (bot, message) {
    debug('unhandled intent received', message)
    bot.reply(message, 'I cannot respond to this.')
  })
}
