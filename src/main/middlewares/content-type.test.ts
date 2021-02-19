import app from '../config/app'
import request from 'supertest'

describe('Content types middleware', () => {
  test('should return default content-type as json', async () => {
    app.get('/test-content-type-json', (req, res) => {
      res.send()
    })
    await request(app)
      .get('/test-content-type-json')
      .expect('content-type', /json/)
  })

  test('should return xml when forced', async () => {
    app.get('/test-content-type-xml', (req, res) => {
      res.type('xml')
      res.send()
    })
    await request(app)
      .get('/test-content-type-xml')
      .expect('content-type', /xml/)
  })
})
