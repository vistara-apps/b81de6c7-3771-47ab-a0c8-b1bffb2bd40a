import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth'
import { MatchingEngine } from '@/lib/matching'
import { MatchModel } from '@/lib/models/match'
import { SchedulingEngine } from '@/lib/scheduling'
import { UserModel } from '@/lib/models/user'
import { PreferenceModel } from '@/lib/models/preference'

async function getMatches(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as any
    const limit = parseInt(searchParams.get('limit') || '20')

    // Get user from auth
    const authHeader = request.headers.get('authorization')!
    const token = authHeader.substring(7)
    const payload = require('@/lib/auth').AuthService.verifyToken(token)

    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const matches = await MatchModel.findUserMatches(payload.userId, status, limit)

    return NextResponse.json({
      success: true,
      matches,
    })
  } catch (error) {
    console.error('Get matches error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function createMatch(request: NextRequest) {
  try {
    const body = await request.json()
    const { targetUserId } = body

    // Get user from auth
    const authHeader = request.headers.get('authorization')!
    const token = authHeader.substring(7)
    const payload = require('@/lib/auth').AuthService.verifyToken(token)

    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Create match
    const match = await MatchingEngine.createMatch(payload.userId, targetUserId)

    return NextResponse.json({
      success: true,
      match,
    })
  } catch (error) {
    console.error('Create match error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function getRecommendations(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '5')

    // Get user from auth
    const authHeader = request.headers.get('authorization')!
    const token = authHeader.substring(7)
    const payload = require('@/lib/auth').AuthService.verifyToken(token)

    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const recommendations = await MatchingEngine.getMatchRecommendations(payload.userId, limit)

    return NextResponse.json({
      success: true,
      recommendations,
    })
  } catch (error) {
    console.error('Get recommendations error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function getMutualSlots(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const otherUserId = searchParams.get('otherUserId')

    if (!otherUserId) {
      return NextResponse.json(
        { error: 'Other user ID is required' },
        { status: 400 }
      )
    }

    // Get user from auth
    const authHeader = request.headers.get('authorization')!
    const token = authHeader.substring(7)
    const payload = require('@/lib/auth').AuthService.verifyToken(token)

    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Get both users' preferences
    const [user1Prefs, user2Prefs] = await Promise.all([
      PreferenceModel.findByUserId(payload.userId),
      PreferenceModel.findByUserId(otherUserId),
    ])

    const [user1, user2] = await Promise.all([
      UserModel.findById(payload.userId),
      UserModel.findById(otherUserId),
    ])

    if (!user1 || !user2) {
      return NextResponse.json(
        { error: 'One or both users not found' },
        { status: 404 }
      )
    }

    // Create scheduling preferences
    const user1SchedulingPrefs = {
      duration: user1Prefs?.meetingDuration || 30,
      availableDays: user1Prefs?.availableDays || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      availableHours: user1Prefs?.availableHours || { start: '09:00', end: '17:00' },
      timezone: user1.timezone,
    }

    const user2SchedulingPrefs = {
      duration: user2Prefs?.meetingDuration || 30,
      availableDays: user2Prefs?.availableDays || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      availableHours: user2Prefs?.availableHours || { start: '09:00', end: '17:00' },
      timezone: user2.timezone,
    }

    // Find mutual time slots
    const mutualSlots = SchedulingEngine.findMutualTimeSlots(
      user1SchedulingPrefs,
      user2SchedulingPrefs
    )

    return NextResponse.json({
      success: true,
      mutualSlots: mutualSlots.map(slot => ({
        ...slot,
        formatted: SchedulingEngine.formatTimeSlot(slot, user1.timezone),
      })),
    })
  } catch (error) {
    console.error('Get mutual slots error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withAuth(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  switch (action) {
    case 'recommendations':
      return getRecommendations(request)
    case 'mutual-slots':
      return getMutualSlots(request)
    default:
      return getMatches(request)
  }
})

export const POST = withAuth(createMatch)

