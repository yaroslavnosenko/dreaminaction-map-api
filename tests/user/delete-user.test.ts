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

test('admin delete user', async () => {
  await request(app)
    .delete('/users/' + manager.id)
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)
  await request(app)
    .get('/users/' + manager.id)
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(404)
})

test('manager or no auth delete user', async () => {
  await request(app)
    .delete('/users/' + admin.id)
    .set({ Authorization: 'Bearer ' + manager.token })
    .expect(403)
  await request(app)
    .delete('/users/' + admin.id)
    .expect(403)
  const res = await request(app)
    .get('/users/' + admin.id)
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)
  expect(res.body.id).toEqual(admin.id)
})
