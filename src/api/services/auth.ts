import jwt from 'jsonwebtoken'
import { appConfigs } from '../../configs'

export class AuthService {
  public static async validate3dPartyToken(
    provider: 'google' | 'facebook',
    token: string
  ): Promise<{ email: string; firstName: string; lastName: string }> {
    // TODO replace by real provider validation
    return { email: token + '@mail.mock', firstName: 'User', lastName: 'Name' }
  }

  public static createToken(userId: string): string {
    return jwt.sign({ uid: userId }, appConfigs.jwtSecret, { expiresIn: '30d' })
  }

  public static validateToken(token: string): { uid: string } | null {
    try {
      const result = jwt.verify(token, appConfigs.jwtSecret)
      console.log(result)
      return { uid: 'id' }
    } catch {
      return null
    }
  }
}
