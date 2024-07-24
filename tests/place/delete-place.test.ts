import request from 'supertest'

import { app } from '../../src/app'
import { Category, UserRole } from '../../src/consts'

import { auth } from '../_auth'

let admin: { token: string; id: string }
let user: { token: string; id: string }
let anotherUser: { token: string; id: string }

let placeId: string
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

  const res = await request(app)
    .post('/places')
    .set({ Authorization: 'Bearer ' + user.token })
    .send(place)
    .expect(201)
  placeId = res.body.id
})

test('admin delete place', async () => {
  await request(app)
    .delete('/places/' + placeId)
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)
  let res = await request(app)
    .get('/users/' + user.id + '/places')
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)
  expect(res.body).toEqual([])
})

test('owner delete place', async () => {
  await request(app)
    .delete('/places/' + placeId)
    .set({ Authorization: 'Bearer ' + user.token })
    .expect(200)
  let res = await request(app)
    .get('/users/' + user.id + '/places')
    .set({ Authorization: 'Bearer ' + user.token })
    .expect(200)
  expect(res.body).toEqual([])
})

test('another user delete place', async () => {
  await request(app)
    .delete('/places/' + placeId)
    .set({ Authorization: 'Bearer ' + anotherUser.token })
    .expect(403)
  let res = await request(app)
    .get('/users/' + user.id + '/places')
    .set({ Authorization: 'Bearer ' + user.token })
    .expect(200)
  expect(res.body[0].name).toBe(place.name)
})

test('no auth delete place', async () => {
  await request(app)
    .delete('/places/' + placeId)
    .expect(403)
  let res = await request(app)
    .get('/users/' + user.id + '/places')
    .set({ Authorization: 'Bearer ' + user.token })
    .expect(200)
  expect(res.body[0].name).toBe(place.name)
})
