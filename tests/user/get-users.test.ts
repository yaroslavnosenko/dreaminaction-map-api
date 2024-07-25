import request from 'supertest'

import { app } from '../../src/app'
import { UserRole } from '../../src/consts'

import { auth } from '../_auth'

let admin: { token: string; id: string }
let user: { token: string; id: string }
let anotherUser: { token: string; id: string }

beforeEach(async () => {
  admin = await auth(UserRole.admin)
  user = await auth(UserRole.user)
  anotherUser = await auth('somebody')
})

test('admin search users', async () => {
  let res = await request(app)
    .get('/users')
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)
  expect(res.body.length).toEqual(3)
})

test('search works', async () => {
  const res = await request(app)
    .get('/users?query=min')
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)
  expect(res.body.length).toEqual(1)
})

test('invalid query', async () => {
  const res = await request(app)
    .get('/users?abc=111')
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)
  expect(res.body.length).toEqual(3)
})

test('user or no auth search users', async () => {
  await request(app)
    .get('/users')
    .set({ Authorization: 'Bearer ' + user.token })
    .expect(403)

  await request(app).get('/users').expect(403)
})
