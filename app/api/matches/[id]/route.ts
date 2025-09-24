import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth'
import { MatchModel } from '@/lib/models/match'
import { SchedulingEngine } from '@/lib/scheduling'

async function getMatch(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const match = await MatchModel.findById(params.id)

    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      match,
    })
  } catch (error) {
    console.error('Get match error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function updateMatch(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { action, scheduledTime, videoCallLink } = body

    // Get user from auth
    const authHeader = request.headers.get('authorization')!
    const token = authHeader.substring(7)
    const payload = require('@/lib/auth').AuthService.verifyToken(token)

    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const match = await MatchModel.findById(params.id)
    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      )
    }

    // Check if user is part of this match
    if (match.user1Id !== payload.userId && match.user2Id !== payload.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    let updatedMatch

    switch (action) {
      case 'accept':
        updatedMatch = await MatchModel.acceptMatch(params.id)
        break

      case 'decline':
        updatedMatch = await MatchModel.declineMatch(params.id)
        break

      case 'schedule':
        if (!scheduledTime) {
          return NextResponse.json(
            { error: 'Scheduled time is required' },
            { status: 400 }
          )
        }

        const videoLink = videoCallLink || SchedulingEngine.generateVideoCallLink()
        updatedMatch = await MatchModel.scheduleMatch(
          params.id,
          new Date(scheduledTime),
          videoLink
        )
        break

      case 'complete':
        updatedMatch = await MatchModel.completeMatch(params.id)
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      match: updatedMatch,
    })
  } catch (error) {
    console.error('Update match error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withAuth(getMatch)
export const PUT = withAuth(updateMatch)

