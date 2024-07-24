import request from 'supertest'
import { app } from '../src/app'
import { UserRole } from '../src/consts'
import { auth } from './_auth'

test('POST /auth', async () => {
  await request(app).post('/auth').expect(400)
  await auth(UserRole.admin)
})
