import request from 'supertest'

import { app } from '../../src/app'
import { Accessibility, Category, UserRole } from '../../src/consts'

import { auth } from '../_auth'

let admin: { token: string; id: string }
let user: { token: string; id: string }
let place1Id: string
let place2Id: string

const place1 = {
  name: 'Food',
  category: Category.food,
  address: 'MAIN ST.',
  lat: 2.5,
  lng: 2.5,
}

const place2 = {
  name: 'Hotel',
  category: Category.hotels,
  address: 'MAIN ST.',
  lat: 2,
  lng: 2,
}

beforeEach(async () => {
  admin = await auth(UserRole.admin)
  user = await auth(UserRole.user)

  let res = await request(app)
    .post('/places')
    .set({ Authorization: 'Bearer ' + user.token })
    .send(place1)
    .expect(201)
  place1Id = res.body.id

  res = await request(app)
    .post('/places')
    .set({ Authorization: 'Bearer ' + user.token })
    .send(place2)
    .expect(201)
  place2Id = res.body.id

  await request(app)
    .put('/places/' + place1Id + '/accessibility')
    .send({ accessibility: Accessibility.compliant })
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)
})

test('get one place', async () => {
  let res = await request(app)
    .get('/places/' + place1Id)
    .expect(200)
  expect(res.body.id).toEqual(place1Id)
  expect(res.body.availableFeatures).toEqual([])
  expect(res.body.unavailableFeatures).toEqual([])
})

test('admin get one place', async () => {
  let res = await request(app)
    .get('/places/' + place1Id)
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)
  expect(res.body.owner.id).toEqual(user.id)
})

test('admin queries', async () => {
  let res = await request(app)
    .get('/places')
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)
  expect(res.body.length).toEqual(2)

  res = await request(app)
    .get('/places?query=Ho')
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)
  expect(res.body.length).toEqual(1)

  res = await request(app)
    .get('/places?query=ho&accessibilities=3')
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)
  expect(res.body.length).toEqual(0)

  res = await request(app)
    .get('/places?accessibilities=0,3')
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)
  expect(res.body.length).toEqual(2)

  res = await request(app)
    .get('/places?categories=food')
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)
  expect(res.body.length).toEqual(1)
})

test('admin invalid queries', async () => {
  let res = await request(app)
    .get('/places?invalid=invalid')
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)
  expect(res.body.length).toEqual(2)

  res = await request(app)
    .get('/places?accessibilities=4')
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(400)

  res = await request(app)
    .get('/places?categories=invalid')
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(400)
})

test('invalid bounds queries', async () => {
  await request(app).get('/places/bounds?invalid=invalid').expect(400)
  await request(app)
    .get('/places/bounds?swLat=a&neLat=3&swLng=0&neLng=3')
    .expect(400)
})

test('bounds queries', async () => {
  let res = await request(app)
    .get('/places/bounds?swLat=0&neLat=3&swLng=0&neLng=3')
    .expect(200)
  expect(res.body.length).toEqual(1)

  res = await request(app)
    .get('/places/bounds?swLat=0&neLat=3&swLng=0&neLng=3&accessibilities=0')
    .expect(200)
  expect(res.body.length).toEqual(1)

  res = await request(app)
    .get(
      '/places/bounds?swLat=0&neLat=3&swLng=0&neLng=3&accessibilities=3&categories=hotels'
    )
    .expect(200)
  expect(res.body.length).toEqual(0)

  res = await request(app)
    .get('/places/bounds?swLat=0&neLat=1&swLng=0&neLng=1')
    .expect(200)
  expect(res.body.length).toEqual(0)
})
