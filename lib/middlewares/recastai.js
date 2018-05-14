'use strict'

const recastaiMiddleware = require('botkit-middleware-recastai')({
  request_token: process.env.RECAST_KEY,
  confidence: 0.5
})

module.exports = recastaiMiddleware
