import Env from '@ioc:Adonis/Core/Env'
import jwt from 'jsonwebtoken'

export default class JwtTokenService {
  public generateNewToken(userId: Number): string {
    const payload = { userId }
    const secret = Env.get('JWT_SECRET')
    const options = { expiresIn: '24h' }

    const token = jwt.sign(payload, secret, options)

    return token
  }

  public verifyToken(token: string): number | null {
    const secret = Env.get('JWT_SECRET')

    try {
      var res = jwt.verify(token, secret)

      return res.userId
    } catch {
      return null
    }
  }
}