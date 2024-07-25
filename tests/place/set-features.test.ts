import request from 'supertest'

import { app } from '../../src/app'
import { Category, UserRole } from '../../src/consts'

import { auth } from '../_auth'

let admin: { token: string; id: string }
let user: { token: string; id: string }

let placeId: string
let feat1Id: string
let feat2Id: string

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

  let res = await request(app)
    .post('/places')
    .set({ Authorization: 'Bearer ' + admin.token })
    .send(place)
    .expect(201)
  placeId = res.body.id

  res = await request(app)
    .post('/features')
    .set({ Authorization: 'Bearer ' + admin.token })
    .send({ name: 'feat1' })
    .expect(201)
  feat1Id = res.body.id

  res = await request(app)
    .post('/features')
    .set({ Authorization: 'Bearer ' + admin.token })
    .send({ name: 'feat2' })
    .expect(201)
  feat2Id = res.body.id
})

test('invalid body or params', async () => {
  await request(app)
    .put('/places/' + crypto.randomUUID() + '/features')
    .set({ Authorization: 'Bearer ' + admin.token })
    .send({
      features: [
        { id: feat1Id, available: true },
        { id: feat2Id, available: false },
      ],
    })
    .expect(404)

  await request(app)
    .put('/places/' + placeId + '/features')
    .set({ Authorization: 'Bearer ' + admin.token })
    .send({
      features: [{ iinvalid: 'invalid' }],
    })
    .expect(400)
})

test('user set features', async () => {
  await request(app)
    .put('/places/' + placeId + '/features')
    .set({ Authorization: 'Bearer ' + user.token })
    .send({
      features: [
        { id: feat1Id, available: true },
        { id: feat2Id, available: false },
      ],
    })
    .expect(403)
})

test('admin set features', async () => {
  await request(app)
    .put('/places/' + placeId + '/features')
    .set({ Authorization: 'Bearer ' + admin.token })
    .send({
      features: [
        { id: feat1Id, available: true },
        { id: feat2Id, available: false },
      ],
    })
    .expect(200)
  let res = await request(app)
    .get('/places/' + placeId)
    .expect(200)
  expect(res.body.availableFeatures.length).toEqual(1)
  expect(res.body.unavailableFeatures.length).toEqual(1)
})

test('admin set empty features', async () => {
  await request(app)
    .put('/places/' + placeId + '/features')
    .set({ Authorization: 'Bearer ' + admin.token })
    .send({
      features: [],
    })
    .expect(200)
  let res = await request(app)
    .get('/places/' + placeId)
    .expect(200)
  expect(res.body.availableFeatures.length).toEqual(0)
  expect(res.body.unavailableFeatures.length).toEqual(0)
})
