import request from 'supertest'

import { AuthService } from '../src/api/services'
import { app } from '../src/app'

export const auth = async (pseudoToken: string) => {
  const response = await request(app)
    .post('/auth')
    .send({ provider: 'facebook', token: pseudoToken })
    .expect(200)
  expect(response.body).toHaveProperty('token')
  const token = response.body['token']
  const payload = AuthService.validateToken(token)
  return { token, id: payload?.uid! }
}
