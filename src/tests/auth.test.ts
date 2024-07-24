import request from 'supertest'
import { app } from '../app'
import { UserRole } from '../database/models'
import { auth } from './_auth'

test('POST /auth', async () => {
  await request(app).post('/auth').expect(400)
  await auth(UserRole.admin)
})
