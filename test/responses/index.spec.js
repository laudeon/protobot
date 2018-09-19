const responses = require('./../../lib/responses')

describe('getResponse', () => {
  test('Should be a function', () => {
    expect(typeof responses.getResponse).toBe('function')
  })

  describe('Happy path', () => {
    test('should return a string', () => {
      expect(typeof responses.getResponse('greetings')).toBe('string')
    })
  })

  describe('No entity found', () => {
    const DEFAULT_MESSAGE = 'no commprendo papa'
    test('Should return the default message', () => {
      expect(responses.getResponse('false')).toBe(DEFAULT_MESSAGE)
    })
  })
})
