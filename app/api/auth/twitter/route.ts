import { NextRequest, NextResponse } from 'next/server'
import { twitterOAuth } from '@/lib/api/twitter'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Generate authorization URL with user ID as state
    const authUrl = twitterOAuth.getAuthorizationUrl(userId)

    return NextResponse.json({
      success: true,
      authUrl,
    })
  } catch (error) {
    console.error('Twitter auth URL generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate authorization URL' },
      { status: 500 }
    )
  }
}

