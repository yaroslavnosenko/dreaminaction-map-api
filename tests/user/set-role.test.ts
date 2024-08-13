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

test('set role with invalid params or body', async () => {
  await request(app)
    .put('/users/' + manager.id + '/role')
    .set({ Authorization: 'Bearer ' + admin.token })
    .send({ invalid: UserRole.manager })
    .expect(400)
  await request(app)
    .put('/users/' + crypto.randomUUID() + '/role')
    .set({ Authorization: 'Bearer ' + admin.token })
    .send({ role: UserRole.manager })
    .expect(404)
  const res = await request(app)
    .get('/users/' + manager.id)
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)
  expect(res.body.role).toEqual(UserRole.manager)
})

test('admin set role', async () => {
  await request(app)
    .put('/users/' + manager.id + '/role')
    .set({ Authorization: 'Bearer ' + admin.token })
    .send({ role: UserRole.admin })
    .expect(200)
  const res = await request(app)
    .get('/users/' + manager.id)
    .set({ Authorization: 'Bearer ' + manager.token })
    .expect(200)
  expect(res.body.role).toEqual(UserRole.admin)
})

test('manager or no auth set role', async () => {
  await request(app)
    .put('/users/' + manager.id + '/role')
    .set({ Authorization: 'Bearer ' + manager.token })
    .send({ role: UserRole.admin })
    .expect(403)
  await request(app)
    .put('/users/' + manager.id + '/role')
    .send({ role: UserRole.admin })
    .expect(403)
  const res = await request(app)
    .get('/users/' + manager.id)
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)
  expect(res.body.role).toEqual(UserRole.manager)
})
