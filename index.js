// @see the botkit documentation for more infos regarding the controller, the bot API and botkit in general

'use strict'

require('dotenv').config({ silent: process.env.NODE_ENV === 'production' })
const io = require('socket.io')(process.env.PORT || 4000)

const botFactory = require('./lib/botFactory')
const websocketListeners = require('./lib/websocketListeners')
const botListeners = require('./lib/botListeners')
const recastaiMiddleware = require('./lib/middlewares/recastai')

// Start bot brain
botFactory.startTicking()

// start listening for incoming websocket events and delegate messages to the botListener
io.on('connection', websocketListeners.vroum(botFactory))

// Init chatbot logic
botListeners.vroum(botFactory, recastaiMiddleware)
