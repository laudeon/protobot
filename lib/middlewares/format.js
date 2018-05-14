'use strict'

module.exports = () => (bot, message, platformMessage, next) => {
  for (let key in message) {
    platformMessage[key] = message[key]
  }
  if (!platformMessage.type) {
    platformMessage.type = 'message'
  }
  next()
}
