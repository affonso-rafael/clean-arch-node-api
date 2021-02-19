import { MongoHelper } from '../mongo-helper'
import { AccountMongoRepository } from './account'

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('should return an account on success', async () => {
    const sut = new AccountMongoRepository()

    const accountData = {
      name: 'any name',
      email: 'any_email@email.com',
      password: 'any_password'
    }

    const account = await sut.execute(accountData)

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe(account.name)
    expect(account.email).toBe(account.email)
    expect(account.password).toBe(account.password)
  })
})
