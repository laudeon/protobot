'use strict'

require('dotenv').config({ silent: process.env.NODE_ENV === 'production' })
const io = require('socket.io')(process.env.PORT || 4000)

const controller = require('./lib/controller')
const webSocketEvents = require('./lib/webSocketEvents')
const chatbot = require('./lib/chatbot')
const recastaiMiddleware = require('./lib/middlewares/recastai')

controller.startTicking()
io.on('connection', webSocketEvents.vroum(controller))
chatbot.vroum(controller, recastaiMiddleware)
