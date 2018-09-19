'use strict'

const debug = require('debug')('protobot:weather-intent')
const {
  getMessageEntity,
  messageHasEntity
} = require('../messageEntityParser')
const responses = require('./../responses')

const DATETIME_ENTITY = 'datetime'
const LOCATION_ENTITY = 'location'

let location
let datetime

module.exports.vroum = (bot, message) => {
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
}

// @private
// Weather convo
// If no location given, ask for it
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

// @private
// Wether convo
// If no date given, ask for it
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

// @private
// Answer with the weather forecast
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
    .catch(err => debug ('Error weather API', err))
}
