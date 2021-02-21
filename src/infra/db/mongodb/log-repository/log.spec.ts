import { Collection } from 'mongodb'
import { MongoHelper } from '../mongo-helper'
import { LogMongoRepository } from './log'

describe('Log Mongo Repository', () => {
  let errorCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })

  test('should create an error log on success', async () => {
    const sut = new LogMongoRepository()
    await sut.logError('any_error')
    const errorCount = await errorCollection.countDocuments()
    expect(errorCount).toBe(1)
  })
})
