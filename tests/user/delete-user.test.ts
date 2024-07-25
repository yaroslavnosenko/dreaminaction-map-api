import request from 'supertest'

import { app } from '../../src/app'
import { Category, UserRole } from '../../src/consts'

import { auth } from '../_auth'

let admin: { token: string; id: string }
let user: { token: string; id: string }
let anotherUser: { token: string; id: string }

const place = {
  name: 'PLACE',
  category: Category.food,
  address: 'MAIN ST.',
  lat: 0,
  lng: 0,
}

beforeEach(async () => {
  admin = await auth(UserRole.admin)
  user = await auth(UserRole.user)
  anotherUser = await auth('somebody')

  await request(app)
    .post('/places')
    .set({ Authorization: 'Bearer ' + user.token })
    .send(place)
    .expect(201)
})

test('admin delete user', async () => {
  await request(app)
    .delete('/users/' + user.id)
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)
  await request(app)
    .get('/users/' + user.id)
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(404)
  const res = await request(app)
    .get('/places')
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)
  expect(res.body).toEqual([])
})

test('user or no auth delete user', async () => {
  await request(app)
    .delete('/users/' + user.id)
    .set({ Authorization: 'Bearer ' + user.token })
    .expect(403)

  await request(app)
    .delete('/users/' + user.id)
    .expect(403)

  const res = await request(app)
    .get('/users/' + user.id)
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)
  expect(res.body.id).toEqual(user.id)
})
