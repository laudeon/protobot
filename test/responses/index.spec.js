const response = require('./../../lib/responses')

describe('getResponse', () => {
  describe('Happy path', () => {
    test('should return a string', () => {
      expect(typeof response.getResponse('greetings')).toBe('string')
    })
  })

  describe('No entity found', () => {
    const DEFAULT_MESSAGE = 'no commprendo papa'
    test('Should return the default message', () => {
      expect(response.getResponse('false')).toBe(DEFAULT_MESSAGE)
    })
  })
})