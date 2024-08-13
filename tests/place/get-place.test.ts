import request from 'supertest'

import { app } from '../../src/app'
import { Accessibility, Category, UserRole } from '../../src/consts'

import { auth } from '../_auth'

let admin: { token: string; id: string }
let manager: { token: string; id: string }
let place1Id: string
let place2Id: string

const place1 = {
  name: 'Food',
  category: Category.food,
  accessibility: Accessibility.unknown,
  address: 'MAIN ST.',
  lat: 0,
  lng: 0,
}

const place2 = {
  name: 'Hotel',
  category: Category.hotels,
  accessibility: Accessibility.compliant,
  address: 'MAIN ST.',
  lat: 0,
  lng: 0,
}

beforeEach(async () => {
  admin = await auth(UserRole.admin)
  manager = await auth(UserRole.manager)

  let res = await request(app)
    .post('/places')
    .set({ Authorization: 'Bearer ' + manager.token })
    .send(place1)
    .expect(201)
  place1Id = res.body.id

  res = await request(app)
    .post('/places')
    .set({ Authorization: 'Bearer ' + manager.token })
    .send(place2)
    .expect(201)
  place2Id = res.body.id
})

test('get one place', async () => {
  let res = await request(app)
    .get('/places/' + place1Id)
    .expect(200)
  expect(res.body.id).toEqual(place1Id)
  expect(res.body.availableFeatures).toEqual([])
  expect(res.body.unavailableFeatures).toEqual([])
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
    .get('/places?query=ho&accessibilities=1')
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

test('get places', async () => {
  let res = await request(app).get('/places/map').expect(200)
  expect(res.body.length).toEqual(1)
})
