import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'
import { UserModel } from '@/lib/models/user'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { telegramId, initData, userData } = body

    // Validate Telegram Web App data
    if (!telegramId || !AuthService.validateTelegramWebAppData(initData || '')) {
      return NextResponse.json(
        { error: 'Invalid authentication data' },
        { status: 400 }
      )
    }

    // Create or update user
    const user = await AuthService.createOrUpdateUser(telegramId, userData)

    // Generate authentication token
    const authResult = await AuthService.authenticateUser(telegramId)

    if (!authResult) {
      return NextResponse.json(
        { error: 'Failed to authenticate user' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      user: authResult.user,
      token: authResult.token,
    })
  } catch (error) {
    console.error('User authentication error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get user from auth token
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const payload = AuthService.verifyToken(token)

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const user = await UserModel.findById(payload.userId)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get user from auth token
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const payload = AuthService.verifyToken(token)

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { userData } = body

    const user = await UserModel.update(payload.userId, userData)

    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

