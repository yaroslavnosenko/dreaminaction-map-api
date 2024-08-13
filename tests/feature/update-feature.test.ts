import request from 'supertest'

import { app } from '../../src/app'
import { UserRole } from '../../src/consts'

import { auth } from '../_auth'

let admin: { token: string; id: string }
let user: { token: string; id: string }
let featureId: string
const oldfeature = { name: 'FEATURE' }
const newFeature = { name: 'NEW_FEATURE' }
const invalidFeature = { not_name: 'INVALID' }

beforeEach(async () => {
  admin = await auth(UserRole.admin)
  user = await auth(UserRole.manager)

  const res = await request(app)
    .post('/features')
    .set({ Authorization: 'Bearer ' + admin.token })
    .send(oldfeature)
    .expect(201)
  featureId = res.body.id
})

test('update with invalid params or body', async () => {
  await request(app).put('/features/qqq').send(newFeature).expect(400)
  await request(app)
    .put('/features/' + featureId)
    .send(invalidFeature)
    .expect(400)
})

test('admin update feature', async () => {
  let res = await request(app).get('/features').expect(200)
  expect(res.body[0].name).toBe(oldfeature.name)

  await request(app)
    .put('/features/' + featureId)
    .set({ Authorization: 'Bearer ' + admin.token })
    .send(newFeature)
    .expect(200)

  res = await request(app).get('/features').expect(200)
  expect(res.body[0].name).toBe(newFeature.name)
})

test('admin update not existing feature', async () => {
  let res = await request(app).get('/features').expect(200)
  expect(res.body[0].name).toBe(oldfeature.name)

  await request(app)
    .put('/features/' + crypto.randomUUID())
    .set({ Authorization: 'Bearer ' + admin.token })
    .send(newFeature)
    .expect(404)

  res = await request(app).get('/features').expect(200)
  expect(res.body[0].name).toBe(oldfeature.name)
})

test('user update feature', async () => {
  let res = await request(app).get('/features').expect(200)
  expect(res.body[0].name).toBe(oldfeature.name)

  await request(app)
    .put('/features/' + featureId)
    .set({ Authorization: 'Bearer ' + user.token })
    .send(newFeature)
    .expect(403)

  res = await request(app).get('/features').expect(200)
  expect(res.body[0].name).toBe(oldfeature.name)
})

test('no auth update feature', async () => {
  let res = await request(app).get('/features').expect(200)
  expect(res.body[0].name).toBe(oldfeature.name)

  await request(app)
    .put('/features/' + featureId)
    .send(newFeature)
    .expect(403)

  res = await request(app).get('/features').expect(200)
  expect(res.body[0].name).toBe(oldfeature.name)
})
