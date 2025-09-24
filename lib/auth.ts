import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { UserModel } from '@/lib/models/user'

export interface JWTPayload {
  userId: string
  telegramId: string
  iat?: number
  exp?: number
}

export class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET!
  private static readonly JWT_EXPIRES_IN = '7d'

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }

  static generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN,
    })
  }

  static verifyToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, this.JWT_SECRET) as JWTPayload
    } catch (error) {
      return null
    }
  }

  static async authenticateUser(telegramId: string): Promise<{ user: any; token: string } | null> {
    try {
      const user = await UserModel.findByTelegramId(telegramId)
      if (!user) {
        return null
      }

      const token = this.generateToken({
        userId: user.id,
        telegramId: user.telegramId,
      })

      return { user, token }
    } catch (error) {
      console.error('Authentication error:', error)
      return null
    }
  }

  static async createOrUpdateUser(telegramId: string, userData?: {
    xProfileUrl?: string
    xHandle?: string
    displayName?: string
    profilePicture?: string
  }): Promise<any> {
    try {
      let user = await UserModel.findByTelegramId(telegramId)

      if (user) {
        // Update existing user
        if (userData) {
          user = await UserModel.update(user.id, userData)
        }
      } else {
        // Create new user
        user = await UserModel.create({
          telegramId,
          ...userData,
        })
      }

      return user
    } catch (error) {
      console.error('User creation/update error:', error)
      throw error
    }
  }

  static extractTelegramIdFromContext(context: any): string | null {
    // Extract telegram ID from MiniKit context
    return context?.user?.id || null
  }

  static validateTelegramWebAppData(initData: string): boolean {
    // Basic validation - in production, implement proper Telegram Web App validation
    // This should verify the initData signature using the bot token
    try {
      // For now, just check if initData exists and has basic structure
      return !!initData && initData.length > 10
    } catch (error) {
      console.error('WebApp data validation error:', error)
      return false
    }
  }
}

export function withAuth(handler: Function) {
  return async (req: Request, ...args: any[]) => {
    try {
      const authHeader = req.headers.get('authorization')
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      const token = authHeader.substring(7)
      const payload = AuthService.verifyToken(token)

      if (!payload) {
        return new Response(JSON.stringify({ error: 'Invalid token' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      // Add user to request object
      ;(req as any).user = payload

      return handler(req, ...args)
    } catch (error) {
      console.error('Auth middleware error:', error)
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }
}

