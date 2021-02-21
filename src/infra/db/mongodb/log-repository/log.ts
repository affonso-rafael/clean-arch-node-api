import { LogErrorRepository } from '../../../../data/use-cases/db-create-account/protocols/log-error-repository'
import { MongoHelper } from '../mongo-helper'

export class LogMongoRepository implements LogErrorRepository {
  async logError (stack: string): Promise<void> {
    const errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.insertOne({
      stack,
      date: new Date()
    })
  }
}
