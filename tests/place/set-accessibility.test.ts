import request from 'supertest'

import { app } from '../../src/app'
import { Accessibility, Category, UserRole } from '../../src/consts'

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

test('set accessibility with invalid body or param', async () => {
  await request(app)
    .put('/places/' + placeId + '/accessibility')
    .send(invalid)
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(400)

  await request(app)
    .put('/places/' + crypto.randomUUID() + '/accessibility')
    .send({ accessibility: Accessibility.compliant })
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(404)

  let res = await request(app)
    .get('/places/' + placeId)
    .expect(200)
  expect(res.body.accessibility).toEqual(Accessibility.unknown)
})

test('set accessibility', async () => {
  await request(app)
    .put('/places/' + placeId + '/accessibility')
    .send({ accessibility: Accessibility.compliant })
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)

  let res = await request(app)
    .get('/places/' + placeId)
    .expect(200)
  expect(res.body.accessibility).toEqual(Accessibility.compliant)
})

test('user or no auth set accessibility', async () => {
  await request(app)
    .put('/places/' + placeId + '/accessibility')
    .send({ accessibility: Accessibility.compliant })
    .set({ Authorization: 'Bearer ' + user.token })
    .expect(403)

  await request(app)
    .put('/places/' + placeId + '/accessibility')
    .send({ accessibility: Accessibility.compliant })
    .expect(403)

  let res = await request(app)
    .get('/places/' + placeId)
    .expect(200)
  expect(res.body.accessibility).toEqual(Accessibility.unknown)
})
