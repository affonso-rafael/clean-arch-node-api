import { CreateAccountRepository } from '../../../../data/use-cases/db-create-account/protocols/create-account-repository'
import { CreateAccountModel } from '../../../../domain/usecases/create-account'
import { AccountModel } from '../../../../domain/usecases/models/account'
import { MongoHelper } from '../mongo-helper'

export class AccountMongoRepository implements CreateAccountRepository {
  async execute (data: CreateAccountModel): Promise<AccountModel | null> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(data)
    return MongoHelper.mapWithId(result.ops[0])
  }
}
