import request from 'supertest'

import { AuthService } from '../src/api/services'
import { app } from '../src/app'

export const auth = async (role: string) => {
  const email = role + '@mail.mock'
  let response = await request(app)
    .post('/auth/otp')
    .send({ email })
    .expect(200)
  response = await request(app)
    .post('/auth/otp/validate')
    .send({ email, otp: '000000' })
    .expect(200)
  expect(response.body).toHaveProperty('token')
  const token = response.body['token']
  const payload = AuthService.validateToken(token)
  return { token, id: payload?.uid! }
}
