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
const invalid = {
  invalid: 'invalid',
}
const newPlace = {
  name: 'NEW_PLACE',
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

test('update with invalid body', async () => {
  await request(app)
    .put('/places/' + placeId)
    .send(invalid)
    .set({ Authorization: 'Bearer ' + user.token })
    .expect(400)
  let res = await request(app)
    .get('/users/' + user.id + '/places')
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)
  expect(res.body[0].name).toEqual(place.name)
})

test('admin update place', async () => {
  await request(app)
    .put('/places/' + placeId)
    .send(newPlace)
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)
  let res = await request(app)
    .get('/users/' + user.id + '/places')
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)
  expect(res.body[0].name).toEqual(newPlace.name)
})

test('owner update place', async () => {
  await request(app)
    .put('/places/' + placeId)
    .send(newPlace)
    .set({ Authorization: 'Bearer ' + user.token })
    .expect(200)
  let res = await request(app)
    .get('/users/' + user.id + '/places')
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)
  expect(res.body[0].name).toEqual(newPlace.name)
})

test('another user update place', async () => {
  await request(app)
    .put('/places/' + placeId)
    .send(newPlace)
    .set({ Authorization: 'Bearer ' + anotherUser.token })
    .expect(403)
  let res = await request(app)
    .get('/users/' + user.id + '/places')
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)
  expect(res.body[0].name).toEqual(place.name)
})

test('no auth update place', async () => {
  await request(app)
    .put('/places/' + placeId)
    .send(newPlace)
    .expect(403)
  let res = await request(app)
    .get('/users/' + user.id + '/places')
    .set({ Authorization: 'Bearer ' + user.token })
    .expect(200)
  expect(res.body[0].name).toBe(place.name)
})

test('update not existing place', async () => {
  await request(app)
    .put('/places/' + crypto.randomUUID())
    .send(newPlace)
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(404)
})
