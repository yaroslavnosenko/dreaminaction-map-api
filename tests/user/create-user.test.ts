import request from 'supertest'

import { app } from '../../src/app'
import { UserRole } from '../../src/consts'

import { auth } from '../_auth'

let admin: { token: string; id: string }
let manager: { token: string; id: string }

beforeEach(async () => {
  admin = await auth(UserRole.admin)
  manager = await auth(UserRole.manager)
})

test('create user with invalid params or body', async () => {
  await request(app)
    .post('/users')
    .set({ Authorization: 'Bearer ' + admin.token })
    .send({ invalid: 'invalid' })
    .expect(400)
  const res = await request(app)
    .get('/users')
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)
  expect(res.body.length).toEqual(2)
})

test('admin create user', async () => {
  await request(app)
    .post('/users')
    .set({ Authorization: 'Bearer ' + admin.token })
    .send({ role: UserRole.manager, email: 'test@mail.mock' })
    .expect(201)

  await request(app)
    .post('/users')
    .set({ Authorization: 'Bearer ' + admin.token })
    .send({ role: UserRole.manager, email: 'test@mail.mock' })
    .expect(409)

  const res = await request(app)
    .get('/users')
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)
  expect(res.body.length).toEqual(3)
})

test('manager or no auth create user', async () => {
  await request(app)
    .post('/users')
    .set({ Authorization: 'Bearer ' + manager.token })
    .send({ role: UserRole.admin, email: 'test@mail.mock' })
    .expect(403)
  await request(app)
    .post('/users')
    .send({ role: UserRole.admin, email: 'test@mail.mock' })
    .expect(403)
  const res = await request(app)
    .get('/users')
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)
  expect(res.body.length).toEqual(2)
})
