import request from 'supertest'
import { app } from '../src/app'
import { UserRole } from '../src/consts'
import { auth } from './_auth'

let admin: { token: string; id: string }
let manager: { token: string; id: string }

beforeEach(async () => {
  admin = await auth(UserRole.admin)
  manager = await auth(UserRole.manager)
})

test('otp with not existing email', async () => {
  await request(app)
    .post('/auth/otp')
    .send({ emai: 'some@mail.mock' })
    .expect(400)
})

test('correct otp', async () => {
  const email = 'admin@mail.mock'
  let response = await request(app)
    .post('/auth/otp')
    .send({ email })
    .expect(200)
  response = await request(app)
    .post('/auth/otp/validate')
    .send({ email, otp: '000000' })
    .expect(200)
})

test('incorrect otp', async () => {
  const email = 'admin@mail.mock'
  let response = await request(app)
    .post('/auth/otp')
    .send({ email })
    .expect(200)
  response = await request(app)
    .post('/auth/otp/validate')
    .send({ email, otp: '111111' })
    .expect(400)
})

test('me', async () => {
  await request(app)
    .get('/auth/me')
    .set({ Authorization: 'Bearer ' + admin.token })
    .expect(200)
  await request(app).get('/auth/me').expect(403)
})
