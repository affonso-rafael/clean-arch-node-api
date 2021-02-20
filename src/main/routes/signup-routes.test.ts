import app from '../config/app'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/mongo-helper'

describe('Signup routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    await MongoHelper.getCollection('accounts').deleteMany({})
  })

  test('should return success', async () => {
    await request(app)
      .post('/signup')
      .send({
        name: 'any name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      })
      .expect(200)
  })
})
