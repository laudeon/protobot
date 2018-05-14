'use strict'

const debug = require('debug')('protobot:chatbot')
const responses = require('./responses')

const DATETIME_ENTITY = 'datetime'
const LOCATION_ENTITY = 'location'

let location
let datetime

module.exports.vroum = (controller, recastaiMiddleware) => {
  controller.hears(['greetings'], 'message_received', recastaiMiddleware.hears, function (bot, message) {
    debug('greetings received', message)
    bot.reply(message, responses.getResponse('greetings'))
  })

  controller.hears(['goodbye'], 'message_received', recastaiMiddleware.hears, function (bot, message) {
    debug('goodbye received', message)
    bot.reply(message, responses.getResponse('goodbye'))
  })

  controller.hears(['say-thanks'], 'message_received', recastaiMiddleware.hears, function (bot, message) {
    debug('thanks received', message)
    bot.reply(message, responses.getResponse('thanks'))
  })

  controller.hears(['get-weather'], 'message_received', recastaiMiddleware.hears, function (bot, message) {
    location = null
    datetime = null

    debug('weather received', message)

    location = getMessageEntity(message, LOCATION_ENTITY)
    datetime = getMessageEntity(message, DATETIME_ENTITY)

    bot.createConversation(message, function (error, convo) {
      if (error) debug(error)

      if (!datetime && !location) {
        askForDate(convo)
        aksForLocation(convo, sendFinalWeatherAnswer)
      } else if (!datetime && location) {
        convo.setVar('location', location.formatted)
        askForDate(convo, sendFinalWeatherAnswer)
      } else if (datetime && !location) {
        convo.setVar('datetime', datetime.iso)
        aksForLocation(convo, sendFinalWeatherAnswer)
      } else {
        convo.setVar('datetime', datetime.iso)
        convo.setVar('location', location.formatted)
        sendFinalWeatherAnswer(convo)
      }

      convo.activate()
    })
  })

  controller.hears('(.*)', 'message_received', function (bot, message) {
    debug('unhandled intent received', message)
    bot.reply(message, 'I cannot respond to this.')
  })
}

const getMessageEntity = (message, wantedEntity) =>
  message.entities.hasOwnProperty(wantedEntity) ? message.entities[wantedEntity][0] : null
// Alias
const messageHasEntity = getMessageEntity

const aksForLocation = function (convo, cb) {
  convo.addQuestion(responses.intents.weather.messages.whichLocation, function (message, convo) {
    location = getMessageEntity(message, LOCATION_ENTITY)
    if (location) {
      convo.setVar('location', location.formatted)
      if (cb && typeof cb === 'function') cb(convo)
      convo.next()
    } else {
      convo.repeat()
    }
  })
}

const askForDate = function (convo, cb) {
  convo.addQuestion(responses.intents.weather.messages.whichDay, function (message, convo) {
    datetime = getMessageEntity(message, DATETIME_ENTITY)
    if (datetime) {
      convo.setVar('datetime', datetime.iso)
      if (cb && typeof cb === 'function') cb(convo)
      convo.next()
    } else {
      convo.repeat()
    }
  })
}

const sendFinalWeatherAnswer = function (convo) {
  responses.getResponse('weather', {
    datetime: datetime.iso,
    location: location.formatted
  })
  .then(answers => {
    convo.setVar('weather', answers[1].weather)
    convo.setVar('tempMin', answers[1].tempMin)
    convo.setVar('tempMax', answers[1].tempMax)
    convo.say(answers[0])
    convo.say(responses.intents.weather.messages.weather)
  })
}
