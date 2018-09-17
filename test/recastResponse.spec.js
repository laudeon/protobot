const recastResponse = require('../lib/recastResponse')

describe('getEntity()', () => {
  let message = {
    entities: {
      test: ['test entity value']
    }
  }
  describe('Happy path', () => {
    test('should return the test entity', () => {
      expect(recastResponse.getEntity(message, 'test')).toBe('test entity value')
    })
  })

  describe('No entity found', () => {
    test('should return null', () => {
      expect(recastResponse.getEntity(message, 'null')).toBe(null)
    })
  })
})

describe('messageHasEntity()', () => {
  let message = {
    entities: {
      test: ['test entity value']
    }
  }
  describe('Happy path', () => {
    test('should return true', () => {
      expect(recastResponse.messageHasEntity(message, 'test')).toBe(true)
    })
  })

  describe('No entity found', () => {
    test('should return false', () => {
      expect(recastResponse.messageHasEntity(message, 'null')).toBe(false)
    })
  })
})