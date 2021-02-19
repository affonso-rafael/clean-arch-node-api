import app from '../config/app'
import request from 'supertest'

describe('Signup routes', () => {
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
