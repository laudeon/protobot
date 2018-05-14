'use strict'

const recastai = require('./recastai')
const format = require('./format')
const categorize = require('./categorize')
const ingest = require('./ingest')

module.exports = {
  format: format(),
  categorize: categorize(),
  ingest: ingest(),
  recastai: recastai
}
