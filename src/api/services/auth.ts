export class AuthService {
  public static async validate3dPartyToken(
    provider: 'google' | 'facebook',
    token: string
  ): Promise<{ email: string; firstName: string; lastName: string }> {
    return { email: token + '@mail.mock', firstName: 'User', lastName: 'Name' }
  }

  public static async createToken(userId: string): Promise<string> {
    return ''
  }

  public static async validateToken(): Promise<{ uid: string }> {
    return { uid: 'id' }
  }
}
