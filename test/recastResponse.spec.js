const {
  getMessageEntity,
  messageHasEntity
} = require('../lib/messageEntityParser')

describe('getMessageEntity()', () => {
  test('Should be a function', () => {
    expect(typeof getMessageEntity).toBe('function')
  })

  let message = {
    entities: {
      test: ['test entity value']
    }
  }

  describe('Happy path', () => {
    test('should return the test entity', () => {
      expect(getMessageEntity(message, 'test')).toBe('test entity value')
    })
  })

  describe('No entity found', () => {
    test('should return null', () => {
      expect(getMessageEntity(message, 'null')).toBe(null)
    })
  })
})

describe('messageHasEntity()', () => {
  test('Should be a function', () => {
    expect(typeof messageHasEntity).toBe('function')
  })

  let message = {
    entities: {
      test: ['test entity value']
    }
  }

  describe('Happy path', () => {
    test('should return true', () => {
      expect(messageHasEntity(message, 'test')).toBe(true)
    })
  })

  describe('No entity found', () => {
    test('should return false', () => {
      expect(messageHasEntity(message, 'null')).toBe(false)
    })
  })
})
