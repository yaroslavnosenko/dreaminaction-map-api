import request from 'supertest'

import { AuthService } from '../src/api/services'
import { app } from '../src/app'
import { UserRole } from '../src/consts'

export const auth = async (role: string) => {
  const email = 'admin@mail.mock'
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

  if (role !== UserRole.admin) {
    const userEmail = role + '@mail.mock'

    response = await request(app)
      .post('/users')
      .set({ Authorization: 'Bearer ' + token })
      .send({ email: userEmail, role: UserRole.manager })
      .expect(201)

    response = await request(app)
      .post('/auth/otp')
      .send({ email: userEmail })
      .expect(200)

    response = await request(app)
      .post('/auth/otp/validate')
      .send({ email: userEmail, otp: '000000' })
      .expect(200)
    expect(response.body).toHaveProperty('token')

    const userToken = response.body['token']
    const userPayload = AuthService.validateToken(userToken)
    return { token: userToken, id: userPayload?.uid! }
  }

  return { token, id: payload?.uid! }
}
