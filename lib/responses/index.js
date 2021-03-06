'use strict'

const goodbye = require('./goodbye')
const greetings = require('./greetings')
const thanks = require('./thanks')
const weather = require('./weather')

const randomArraySelect = array => array[Math.floor(Math.random() * array.length)]
const DEFAULT_MESSAGE = 'no commprendo papa'

module.exports.getResponse = (intent, options) => {
  switch (intent) {
    case 'goodbye':
      return randomArraySelect(goodbye)
    case 'greetings':
      return randomArraySelect(greetings)
    case 'thanks':
      return randomArraySelect(thanks)
    case 'weather':
      return weather.getResponse(options)
    default:
      return DEFAULT_MESSAGE
  }
}

module.exports.intents = {
  goodbye: goodbye,
  greetings: greetings,
  weather: weather
}
