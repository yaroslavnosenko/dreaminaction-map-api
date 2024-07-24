import request from 'supertest'
import { app } from '../app'

test('POST /auth', async () => {
  await request(app).post('/auth').expect(400)
  await request(app)
    .post('/auth')
    .send({ provider: 'facebook', token: 'admin' })
    .expect(200)
    .then((res) => {
      expect(res.body).toHaveProperty('token')
    })
})
