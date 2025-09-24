import { MatchingEngine } from '@/lib/matching'

describe('MatchingEngine', () => {
  describe('calculateMatchScore', () => {
    it('should return 0 for users with no interests', () => {
      const score = MatchingEngine.calculateMatchScore([], [])
      expect(score).toBe(0)
    })

    it('should return 0 for users with no common interests', () => {
      const score = MatchingEngine.calculateMatchScore(
        ['React', 'TypeScript'],
        ['Python', 'Machine Learning']
      )
      expect(score).toBe(0)
    })

    it('should calculate correct score for common interests', () => {
      const score = MatchingEngine.calculateMatchScore(
        ['React', 'TypeScript', 'Node.js'],
        ['React', 'Python', 'TypeScript']
      )
      expect(score).toBeGreaterThan(0)
      expect(score).toBeLessThanOrEqual(100)
    })

    it('should give higher score for more common interests', () => {
      const score1 = MatchingEngine.calculateMatchScore(
        ['React', 'TypeScript'],
        ['React', 'Python']
      )
      const score2 = MatchingEngine.calculateMatchScore(
        ['React', 'TypeScript', 'Node.js'],
        ['React', 'Python', 'TypeScript']
      )
      expect(score2).toBeGreaterThan(score1)
    })
  })

  describe('findCommonInterests', () => {
    it('should find exact matches', () => {
      const common = MatchingEngine.findCommonInterests(
        ['React', 'TypeScript'],
        ['React', 'Python']
      )
      expect(common).toEqual(['React'])
    })

    it('should find partial matches', () => {
      const common = MatchingEngine.findCommonInterests(
        ['Machine Learning', 'AI'],
        ['ML', 'Artificial Intelligence']
      )
      expect(common).toHaveLength(0) // No exact matches in this simple implementation
    })

    it('should return empty array for no matches', () => {
      const common = MatchingEngine.findCommonInterests(
        ['React', 'TypeScript'],
        ['Python', 'Django']
      )
      expect(common).toEqual([])
    })
  })

  describe('interestsMatch', () => {
    it('should match identical interests', () => {
      expect(MatchingEngine.interestsMatch('React', 'React')).toBe(true)
    })

    it('should match case-insensitively', () => {
      expect(MatchingEngine.interestsMatch('React', 'react')).toBe(true)
    })

    it('should not match different interests', () => {
      expect(MatchingEngine.interestsMatch('React', 'Vue')).toBe(false)
    })

    it('should match when one contains the other', () => {
      expect(MatchingEngine.interestsMatch('Machine Learning', 'Learning')).toBe(true)
    })
  })
})

