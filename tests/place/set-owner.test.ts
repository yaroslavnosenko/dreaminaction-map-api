import request from 'supertest'

import { app } from '../../src/app'
import { Category, UserRole } from '../../src/consts'

import { auth } from '../_auth'

let admin: { token: string; id: string }
let user: { token: string; id: string }

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

beforeEach(async () => {
  admin = await auth(UserRole.admin)
  user = await auth(UserRole.user)

  const res = await request(app)
    .post('/places')
    .set({ Authorization: 'Bearer ' + user.token })
    .send(place)
    .expect(201)
  placeId = res.body.id
})

test('set owner with invalid body', async () => {
  await request(app)
    .put('/places/' + placeId + '/owner')
    .send(invalid)
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(400)
  let res = await request(app)
    .get('/users/' + user.id + '/places')
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)
  expect(res.body[0].name).toEqual(place.name)
})

test('set owner with invalid user', async () => {
  await request(app)
    .put('/places/' + placeId + '/owner')
    .send({ id: crypto.randomUUID() })
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(404)
  let res = await request(app)
    .get('/users/' + user.id + '/places')
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)
  expect(res.body[0].name).toEqual(place.name)
})

test('set owner with valid user', async () => {
  await request(app)
    .put('/places/' + placeId + '/owner')
    .send({ id: admin.id })
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)

  let res = await request(app)
    .get('/users/' + admin.id + '/places')
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)
  expect(res.body[0].name).toEqual(place.name)

  res = await request(app)
    .get('/users/' + user.id + '/places')
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)
  expect(res.body).toEqual([])
})

test('user or no auth set owner', async () => {
  await request(app)
    .put('/places/' + placeId + '/owner')
    .send({ id: crypto.randomUUID() })
    .set({ Authorization: 'Bearer ' + user.token })
    .expect(403)

  await request(app)
    .put('/places/' + placeId + '/owner')
    .send({ id: crypto.randomUUID() })
    .set({ Authorization: 'Bearer ' + user.token })
    .expect(403)

  let res = await request(app)
    .get('/users/' + user.id + '/places')
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)
  expect(res.body[0].name).toEqual(place.name)
})
