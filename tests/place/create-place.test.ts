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

test('create with invalid params or body', async () => {
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

// test('admin create feature', async () => {
//   await request(app)
//     .post('/features')
//     .set({ Authorization: 'Bearer ' + admin.token })
//     .send(feature)
//     .expect(201)
//   let res = await request(app).get('/features').expect(200)
//   expect(res.body[0].name).toBe(feature.name)
// })

// test('user create feature', async () => {
//   await request(app)
//     .post('/features')
//     .set({ Authorization: 'Bearer ' + user.token })
//     .send(feature)
//     .expect(403)
//   let res = await request(app).get('/features').expect(200)
//   expect(res.body).toEqual([])
// })

// test('no auth create feature', async () => {
//   await request(app).post('/features').send(feature).expect(403)
//   let res = await request(app).get('/features').expect(200)
//   expect(res.body).toEqual([])
// })
