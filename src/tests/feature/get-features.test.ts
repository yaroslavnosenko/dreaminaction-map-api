import request from 'supertest'
import { app } from '../../app'
import { UserRole } from '../../database/models'
import { auth } from '../_auth'

test('get empty features', async () => {
  const res = await request(app).get('/features').expect(200)
  expect(res.body).toEqual([])
})

test('get features array', async () => {
  const admin = await auth(UserRole.admin)
  const feature = { name: 'AAA' }

  await request(app)
    .post('/features')
    .set({ Authorization: 'Bearer ' + admin.token })
    .send(feature)
    .expect(201)

  const res = await request(app).get('/features').expect(200)
  expect(res.body).toHaveLength(1)
})
