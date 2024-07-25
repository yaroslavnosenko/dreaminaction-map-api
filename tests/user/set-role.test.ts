import request from 'supertest'

import { app } from '../../src/app'
import { UserRole } from '../../src/consts'

import { auth } from '../_auth'

let admin: { token: string; id: string }
let user: { token: string; id: string }

beforeEach(async () => {
  admin = await auth(UserRole.admin)
  user = await auth(UserRole.user)
})

test('set role with invalid params or body', async () => {
  await request(app)
    .put('/users/' + user.id + '/role')
    .set({ Authorization: 'Bearer ' + admin.token })
    .send({ invalid: UserRole.manager })
    .expect(400)
  await request(app)
    .put('/users/' + crypto.randomUUID() + '/role')
    .set({ Authorization: 'Bearer ' + admin.token })
    .send({ role: UserRole.manager })
    .expect(404)
  const res = await request(app)
    .get('/users/' + user.id)
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)
  expect(res.body.role).toEqual(UserRole.user)
})

test('admin set role', async () => {
  await request(app)
    .put('/users/' + user.id + '/role')
    .set({ Authorization: 'Bearer ' + admin.token })
    .send({ role: UserRole.manager })
    .expect(200)
  const res = await request(app)
    .get('/users/' + user.id)
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)
  expect(res.body.role).toEqual(UserRole.manager)
})

test('user or no auth set role', async () => {
  await request(app)
    .put('/users/' + user.id + '/role')
    .set({ Authorization: 'Bearer ' + user.token })
    .send({ role: UserRole.manager })
    .expect(403)
  await request(app)
    .put('/users/' + user.id + '/role')
    .send({ role: UserRole.manager })
    .expect(403)
  const res = await request(app)
    .get('/users/' + user.id)
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)
  expect(res.body.role).toEqual(UserRole.user)
})
