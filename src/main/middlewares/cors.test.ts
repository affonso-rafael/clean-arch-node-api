import app from '../config/app'
import request from 'supertest'

describe('Cors middleware', () => {
  test('should enable cors', async () => {
    app.get('/test-cors', (req, res) => {
      res.send()
    })
    await request(app)
      .get('/test-cors')
      .expect('access-controll-allow-origin', '*')
      .expect('access-controll-allow-methods', '*')
      .expect('access-controll-allow-headers', '*')
  })
})
