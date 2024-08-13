import request from 'supertest'

import { app } from '../../src/app'
import { Accessibility, Category, UserRole } from '../../src/consts'

import { auth } from '../_auth'

let admin: { token: string; id: string }
let manager: { token: string; id: string }

let placeId: string
const place = {
  name: 'PLACE',
  category: Category.food,
  accessibility: Accessibility.unknown,
  address: 'MAIN ST.',
  lat: 0,
  lng: 0,
}

beforeEach(async () => {
  admin = await auth(UserRole.admin)
  manager = await auth(UserRole.manager)

  const res = await request(app)
    .post('/places')
    .set({ Authorization: 'Bearer ' + manager.token })
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
    .get('/places')
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)
  expect(res.body).toEqual([])
})

test('manager delete place', async () => {
  await request(app)
    .delete('/places/' + placeId)
    .set({ Authorization: 'Bearer ' + manager.token })
    .expect(403)
  let res = await request(app)
    .get('/places')
    .set({ Authorization: 'Bearer ' + manager.token })
    .expect(200)
  expect(res.body.length).toBe(1)
})

test('no auth delete place', async () => {
  await request(app)
    .delete('/places/' + placeId)
    .expect(403)
  let res = await request(app)
    .get('/places')
    .set({ Authorization: 'Bearer ' + manager.token })
    .expect(200)
  expect(res.body.length).toBe(1)
})
