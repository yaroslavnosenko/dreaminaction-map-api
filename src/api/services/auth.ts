import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

import { Raw } from 'typeorm'
import { appConfigs } from '../../consts'
import { Otp } from '../../database'
import { TokenResponse } from '../dtos/responses'

export class AuthService {
  public static async validateOtp(
    email: string,
    otp: string
  ): Promise<boolean> {
    await Otp.delete({
      createdAt: Raw((alias) => `${alias} < NOW() - INTERVAL 90 SECOND`),
    })
    const dbOtp = await Otp.findOneBy({ email })
    if (!dbOtp || dbOtp.otp !== otp) {
      return false
    }
    await dbOtp.remove()
    return true
  }

  public static async sendOtp(email: string): Promise<boolean> {
    await Otp.delete({ email })
    const otp = this.generateOTP()
    await Otp.create({ email, otp }).save()
    await this.sendEmail(email, otp)
    return true
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

  private static async sendEmail(email: string, otp: string): Promise<boolean> {
    if (process.env.NODE_ENV === 'test') {
      return true
    }
    try {
      const transporter = nodemailer.createTransport({
        host: appConfigs.smtp.host,
        port: 465,
        secure: true,
        auth: {
          user: appConfigs.smtp.user,
          pass: appConfigs.smtp.password,
        },
      })

      await transporter.sendMail({
        from: '"Dream In Action" <' + appConfigs.smtp.user + '>',
        to: email,
        subject: 'OTP Code',
        text: 'Your code is ' + otp,
      })
      return true
    } catch {
      return false
    }
  }

  private static generateOTP(): string {
    if (process.env.NODE_ENV === 'test') {
      return '000000'
    }
    const otp = Math.floor(100000 + Math.random() * 900000)
    return otp.toString()
  }
}
