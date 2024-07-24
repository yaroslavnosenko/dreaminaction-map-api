import request from 'supertest'

import { app } from '../../src/app'
import { UserRole } from '../../src/consts'

import { auth } from '../_auth'

let admin: { token: string; id: string }
let user: { token: string; id: string }
let featureId: string

beforeEach(async () => {
  admin = await auth(UserRole.admin)
  user = await auth(UserRole.user)
  const feature = { name: 'FEATURE' }
  const res = await request(app)
    .post('/features')
    .set({ Authorization: 'Bearer ' + admin.token })
    .send(feature)
    .expect(201)
  featureId = res.body.id
})

test('delete with invalid params', async () => {
  await request(app).delete('/features/qqq').expect(400)
})

test('admin delete feature', async () => {
  let res = await request(app).get('/features').expect(200)
  expect(res.body).toHaveLength(1)

  await request(app)
    .delete('/features/' + featureId)
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)

  res = await request(app).get('/features').expect(200)
  expect(res.body).toHaveLength(0)
})

test('user delete feature', async () => {
  let res = await request(app).get('/features').expect(200)
  expect(res.body).toHaveLength(1)

  await request(app)
    .delete('/features/' + featureId)
    .set({ Authorization: 'Bearer ' + user.token })
    .expect(403)

  res = await request(app).get('/features').expect(200)
  expect(res.body).toHaveLength(1)
})

test('no auth delete feature', async () => {
  let res = await request(app).get('/features').expect(200)
  expect(res.body).toHaveLength(1)

  await request(app)
    .delete('/features/' + featureId)
    .expect(403)

  res = await request(app).get('/features').expect(200)
  expect(res.body).toHaveLength(1)
})
