import request from 'supertest'

import { app } from '../../src/app'
import { Accessibility, Category, UserRole } from '../../src/consts'

import { auth } from '../_auth'

let admin: { token: string; id: string }
let manager: { token: string; id: string }
const place = {
  name: 'PLACE',
  category: Category.food,
  accessibility: Accessibility.unknown,
  address: 'MAIN ST.',
  lat: 0,
  lng: 0,
}
const invalidPlace = { param: 'INVALID' }

beforeEach(async () => {
  admin = await auth(UserRole.admin)
  manager = await auth(UserRole.manager)
})

test('create with invalid body', async () => {
  let res = await request(app)
    .get('/places')
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)
  expect(res.body).toEqual([])
  await request(app).post('/features').send(invalidPlace).expect(400)
  res = await request(app)
    .get('/places')
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)
  expect(res.body).toEqual([])
})

test('create place', async () => {
  await request(app)
    .post('/places')
    .set({ Authorization: 'Bearer ' + manager.token })
    .send(place)
    .expect(201)
  let res = await request(app)
    .get('/places')
    .set({ Authorization: 'Bearer ' + manager.token })
    .expect(200)
  expect(res.body.length).toBe(1)
})

test('no auth create place', async () => {
  await request(app).post('/places').send(place).expect(403)
  let res = await request(app)
    .get('/places')
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)
  expect(res.body).toEqual([])
})
