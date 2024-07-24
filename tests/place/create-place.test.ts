import request from 'supertest'

import { app } from '../../src/app'
import { Category, UserRole } from '../../src/consts'

import { auth } from '../_auth'

let admin: { token: string; id: string }
let user: { token: string; id: string }
const place = {
  name: 'PLACE',
  category: Category.food,
  address: 'MAIN ST.',
  lat: 0,
  lng: 0,
}
const invalidPlace = { param: 'INVALID' }

beforeEach(async () => {
  admin = await auth(UserRole.admin)
  user = await auth(UserRole.user)
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

test('auth create place', async () => {
  await request(app)
    .post('/places')
    .set({ Authorization: 'Bearer ' + user.token })
    .send(place)
    .expect(201)
  let res = await request(app)
    .get('/users/' + user.id + '/places')
    .set({ Authorization: 'Bearer ' + user.token })
    .expect(200)
  expect(res.body[0].name).toBe(place.name)
})

test('no auth create place', async () => {
  await request(app).post('/places').send(place).expect(403)
  let res = await request(app)
    .get('/places')
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)
  expect(res.body).toEqual([])
})
