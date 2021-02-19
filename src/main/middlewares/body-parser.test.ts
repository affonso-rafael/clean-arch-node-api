import request from 'supertest'
import app from '../config/app'

describe('Body Parser Middleware', () => {
  test('body parser middleware', async () => {
    app.post('/test-body-parser', (req, res) => {
      res.send(req.body)
    })

    await request(app)
      .post('/test-body-parser')
      .send({ name: 'any name' })
      .expect({ name: 'any name' })
  })
})
