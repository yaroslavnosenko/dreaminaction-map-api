import request from 'supertest'
import { app } from '../../app'
import { UserRole } from '../../database/models'
import { auth } from '../_auth'

let admin: { token: string; id: string }
let user: { token: string; id: string }
const feature = { name: 'FEATURE' }
const invalidFeature = { not_name: 'INVALID' }

beforeEach(async () => {
  admin = await auth(UserRole.admin)
  user = await auth(UserRole.user)
})

test('create with invalid params or body', async () => {
  let res = await request(app).get('/features').expect(200)
  expect(res.body).toEqual([])
  await request(app).post('/features').send(invalidFeature).expect(400)
  res = await request(app).get('/features').expect(200)
  expect(res.body).toEqual([])
})

test('admin create feature', async () => {
  await request(app)
    .post('/features')
    .set({ Authorization: 'Bearer ' + admin.token })
    .send(feature)
    .expect(201)
  let res = await request(app).get('/features').expect(200)
  expect(res.body[0].name).toBe(feature.name)
})

test('user create feature', async () => {
  await request(app)
    .post('/features')
    .set({ Authorization: 'Bearer ' + user.token })
    .send(feature)
    .expect(403)
  let res = await request(app).get('/features').expect(200)
  expect(res.body).toEqual([])
})

test('no auth create feature', async () => {
  await request(app).post('/features').send(feature).expect(403)
  let res = await request(app).get('/features').expect(200)
  expect(res.body).toEqual([])
})
