// @see the botkit documentation for more infos regarding the controller and bot API

'use strict'

require('dotenv').config({ silent: process.env.NODE_ENV === 'production' })
const io = require('socket.io')(process.env.PORT || 4000)

const controller = require('./lib/controller')
const websocket = require('./lib/websocket')
const chatbot = require('./lib/chatbot')
const recastaiMiddleware = require('./lib/middlewares/recastai')

controller.startTicking() // Start controller
io.on('connection', websocket.vroum(controller)) // start listening for incominn message event and delegate message to controller
chatbot.vroum(controller, recastaiMiddleware) // Init chatbot logic
