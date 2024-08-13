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

test('admin get users', async () => {
  let res = await request(app)
    .get('/users')
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)
  expect(res.body.length).toEqual(2)
})

test('admin get one user', async () => {
  let res = await request(app)
    .get('/users/' + manager.id)
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)
  expect(res.body.id).toEqual(manager.id)
})

test('manager get users/users', async () => {
  await request(app)
    .get('/users')
    .set({ Authorization: 'Bearer ' + manager.token })
    .expect(403)

  await request(app)
    .get('/users/' + manager.id)
    .set({ Authorization: 'Bearer ' + manager.token })
    .expect(403)
})

test('no auth get users/users', async () => {
  await request(app).get('/users').expect(403)
  await request(app)
    .get('/users/' + manager.id)
    .expect(403)
})
