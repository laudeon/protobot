'use strict'

// TODO why? then doc.
module.exports = () => (bot, message, next) => {
  message.type = message.type === 'message' ? 'message_received' : message.type
  next()
}
