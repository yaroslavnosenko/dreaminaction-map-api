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

test('admin or me get places', async () => {
  let res = await request(app)
    .get('/users/' + user.id + '/places')
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)
  expect(res.body.length).toEqual(1)

  res = await request(app)
    .get('/users/' + user.id + '/places')
    .set({ Authorization: 'Bearer ' + user.token })
    .expect(200)
  expect(res.body.length).toEqual(1)
})

test('another user or no auth get places', async () => {
  await request(app)
    .get('/users/' + user.id + '/places')
    .set({ Authorization: 'Bearer ' + anotherUser.token })
    .expect(403)

  await request(app)
    .get('/users/' + user.id + '/places')
    .expect(403)
})
