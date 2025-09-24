import { NextRequest, NextResponse } from 'next/server'
import { twitterOAuth, fetchTwitterProfile, fetchRecentTweets, extractInterestsFromTwitterData } from '@/lib/api/twitter'
import { UserModel } from '@/lib/models/user'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state') // This should be the userId
    const error = searchParams.get('error')

    if (error) {
      console.error('Twitter OAuth error:', error)
      return NextResponse.redirect(
        new URL('/?error=twitter_auth_failed', request.url)
      )
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/?error=missing_oauth_params', request.url)
      )
    }

    // Exchange code for access token
    const tokenData = await twitterOAuth.exchangeCodeForToken(code)

    // Get user profile from Twitter
    const profile = await fetchTwitterProfile(state) // state contains the Twitter handle

    // Get recent tweets
    const tweets = await fetchRecentTweets(profile.id, 20)

    // Extract interests using AI
    const interests = await extractInterestsFromTwitterData(profile, tweets)

    // Update user in database
    const user = await UserModel.findByTelegramId(state) // state should be telegramId in production

    if (user) {
      await UserModel.update(user.id, {
        xProfileUrl: `https://twitter.com/${profile.username}`,
        xHandle: profile.username,
        displayName: profile.name,
        bio: profile.description,
        profilePicture: profile.profile_image_url,
        extractedInterests: interests,
      })
    }

    // Redirect back to the app with success
    return NextResponse.redirect(
      new URL('/?success=twitter_connected', request.url)
    )
  } catch (error) {
    console.error('Twitter OAuth callback error:', error)
    return NextResponse.redirect(
      new URL('/?error=twitter_callback_failed', request.url)
    )
  }
}

