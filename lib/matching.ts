import { UserModel } from '@/lib/models/user'
import { MatchModel } from '@/lib/models/match'
import { generateConversationStarters } from '@/lib/api'

export interface MatchCandidate {
  user: any
  score: number
  commonInterests: string[]
}

export class MatchingEngine {
  static async findMatchesForUser(
    userId: string,
    limit: number = 10,
    excludeIds: string[] = []
  ): Promise<MatchCandidate[]> {
    try {
      // Get current user
      const currentUser = await UserModel.findById(userId)
      if (!currentUser) {
        throw new Error('User not found')
      }

      // Get potential matches
      const potentialUsers = await UserModel.findPotentialMatches(
        userId,
        limit * 2, // Get more candidates for better matching
        excludeIds
      )

      // Calculate match scores
      const candidates: MatchCandidate[] = []

      for (const user of potentialUsers) {
        const score = this.calculateMatchScore(
          currentUser.extractedInterests,
          user.extractedInterests
        )

        if (score > 0) {
          const commonInterests = this.findCommonInterests(
            currentUser.extractedInterests,
            user.extractedInterests
          )

          candidates.push({
            user,
            score,
            commonInterests,
          })
        }
      }

      // Sort by score (highest first) and return top matches
      return candidates
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)

    } catch (error) {
      console.error('Error finding matches:', error)
      return []
    }
  }

  static calculateMatchScore(
    user1Interests: string[],
    user2Interests: string[]
  ): number {
    if (!user1Interests.length || !user2Interests.length) {
      return 0
    }

    const commonInterests = this.findCommonInterests(user1Interests, user2Interests)
    const totalUniqueInterests = new Set([...user1Interests, ...user2Interests]).size

    // Base score from common interests
    const baseScore = (commonInterests.length / Math.min(user1Interests.length, user2Interests.length)) * 100

    // Bonus for having multiple common interests
    const diversityBonus = commonInterests.length > 1 ? commonInterests.length * 5 : 0

    // Penalty for too few interests (less meaningful matches)
    const interestPenalty = Math.min(user1Interests.length, user2Interests.length) < 2 ? -20 : 0

    const finalScore = Math.max(0, Math.min(100, baseScore + diversityBonus + interestPenalty))

    return Math.round(finalScore)
  }

  static findCommonInterests(
    user1Interests: string[],
    user2Interests: string[]
  ): string[] {
    return user1Interests.filter(interest =>
      user2Interests.some(user2Interest =>
        this.interestsMatch(interest, user2Interest)
      )
    )
  }

  static interestsMatch(interest1: string, interest2: string): boolean {
    // Normalize interests for comparison
    const normalize = (str: string) =>
      str.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '')

    const normalized1 = normalize(interest1)
    const normalized2 = normalize(interest2)

    // Exact match
    if (normalized1 === normalized2) {
      return true
    }

    // Partial match (one contains the other)
    if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
      return true
    }

    // Check for common keywords
    const keywords1 = normalized1.split(/\s+/)
    const keywords2 = normalized2.split(/\s+/)

    const commonKeywords = keywords1.filter(keyword =>
      keywords2.includes(keyword) && keyword.length > 2
    )

    return commonKeywords.length > 0
  }

  static async createMatch(
    user1Id: string,
    user2Id: string
  ): Promise<any> {
    try {
      // Check if match already exists
      const existingMatch = await MatchModel.findByUsers(user1Id, user2Id)
      if (existingMatch) {
        return existingMatch
      }

      // Get both users
      const [user1, user2] = await Promise.all([
        UserModel.findById(user1Id),
        UserModel.findById(user2Id),
      ])

      if (!user1 || !user2) {
        throw new Error('One or both users not found')
      }

      // Calculate match score
      const matchScore = this.calculateMatchScore(
        user1.extractedInterests,
        user2.extractedInterests
      )

      // Generate conversation starters
      const conversationStarters = await generateConversationStarters(
        user1.extractedInterests,
        user2.extractedInterests
      )

      // Create match
      const match = await MatchModel.create({
        user1Id,
        user2Id,
        matchScore,
        conversationStarters,
      })

      return match
    } catch (error) {
      console.error('Error creating match:', error)
      throw error
    }
  }

  static async getMatchRecommendations(
    userId: string,
    limit: number = 5
  ): Promise<MatchCandidate[]> {
    try {
      // Get existing matches to exclude
      const existingMatches = await MatchModel.findUserMatches(userId)
      const excludeIds = existingMatches.flatMap(match =>
        match.user1Id === userId ? [match.user2Id] : [match.user1Id]
      )

      return this.findMatchesForUser(userId, limit, excludeIds)
    } catch (error) {
      console.error('Error getting match recommendations:', error)
      return []
    }
  }
}

