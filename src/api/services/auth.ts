import jwt from 'jsonwebtoken'

import { appConfigs } from '../../consts'
import { TokenResponse } from '../dtos/responses'

export class AuthService {
  public static async validate3dPartyToken(
    provider: 'google' | 'facebook',
    token: string
  ): Promise<{ email: string }> {
    // TODO replace by real provider validation
    return { email: token + '@mail.mock' }
  }

  public static createToken(userId: string): TokenResponse {
    return {
      token: jwt.sign({ uid: userId }, appConfigs.jwtSecret, {
        expiresIn: '30d',
      }),
    }
  }

  public static validateToken(token: string): { uid: string } | null {
    try {
      const { uid } = jwt.verify(token, appConfigs.jwtSecret) as { uid: string }
      return { uid }
    } catch {
      return null
    }
  }
}
