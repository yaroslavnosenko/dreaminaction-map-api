import { UserRole } from '../database/models'

import request from 'supertest'
import { AuthService } from '../api/services'
import { app } from '../app'

export const auth = async (role: UserRole) => {
  const response = await request(app)
    .post('/auth')
    .send({ provider: 'facebook', token: role })
    .expect(200)
  expect(response.body).toHaveProperty('token')
  const token = response.body['token']
  const payload = AuthService.validateToken(token)
  return { token, id: payload?.uid! }
}
