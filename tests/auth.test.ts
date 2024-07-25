import request from 'supertest'
import { app } from '../src/app'
import { UserRole } from '../src/consts'
import { auth } from './_auth'

test('/auth', async () => {
  await request(app).post('/auth').expect(400)
  await auth(UserRole.admin)
})

test('invalid token', async () => {
  await request(app)
    .get('/places/' + crypto.randomUUID())
    .set({ Authorization: 'Bearer ' + crypto.randomUUID() })
    .expect(404)
})
