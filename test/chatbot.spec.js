const chatbot = require('./../lib/chatbot')

const NUMBER_OF_INTENTS = 5

let controller
let recastaiMiddleware

beforeAll(() => {
  controller = {
    hears: jest.fn()
  }
  recastaiMiddleware = {
    hears: jest.fn()
  }
})

afterEach(() => {
  controller.hears.mockClear()
})

describe('Happy path', () => {
  test(`should hear ${NUMBER_OF_INTENTS} intents`, () => {
    chatbot.vroum(controller, recastaiMiddleware)
    expect(controller.hears).toBeCalledTimes(NUMBER_OF_INTENTS) // Number of intents handled by the bot
  })

  test('Should handle not found intent', () => {
    const LAST_MOCK_CALL = NUMBER_OF_INTENTS - 1
    chatbot.vroum(controller, recastaiMiddleware)
    expect(controller.hears.mock.calls[LAST_MOCK_CALL][0]).toEqual("(.*)")
  })
})