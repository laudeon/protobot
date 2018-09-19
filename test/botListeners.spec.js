const botListeners = require('../lib/botListeners')

const NUMBER_OF_INTENTS = 5

let botFactory
let recastaiMiddleware

beforeAll(() => {
  botFactory = {
    hears: jest.fn()
  }
  recastaiMiddleware = {
    hears: jest.fn()
  }
})

afterEach(() => {
  botFactory.hears.mockClear()
})

describe('vroum()', () => {
  test('Should be a function', () => {
    expect(typeof botListeners.vroum).toBe('function')
  })

  describe('Happy path', () => {
    test(`should hear ${NUMBER_OF_INTENTS} intents`, () => {
      botListeners.vroum(botFactory, recastaiMiddleware)
      expect(botFactory.hears).toBeCalledTimes(NUMBER_OF_INTENTS) // Number of intents handled by the bot
    })
  
    test('Should handle not found intent', () => {
      const LAST_MOCK_CALL = NUMBER_OF_INTENTS - 1
      botListeners.vroum(botFactory, recastaiMiddleware)
      expect(botFactory.hears.mock.calls[LAST_MOCK_CALL][0]).toEqual("(.*)")
    })
  })
})
