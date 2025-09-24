import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create sample users
  const users = [
    {
      telegramId: '123456789',
      xHandle: 'techfounder',
      displayName: 'Alex Chen',
      bio: 'Full-stack developer passionate about React, AI, and building great products. Currently working on fintech solutions.',
      extractedInterests: ['React', 'AI', 'Startups', 'Product Design', 'TypeScript'],
      timezone: 'America/Los_Angeles',
    },
    {
      telegramId: '987654321',
      xHandle: 'designguru',
      displayName: 'Sarah Kim',
      bio: 'UX Designer helping startups create beautiful, user-centered products.',
      extractedInterests: ['UX Design', 'Product Design', 'Startups', 'Figma', 'User Research'],
      timezone: 'America/New_York',
    },
    {
      telegramId: '456789123',
      xHandle: 'airesearcher',
      displayName: 'Dr. Michael Zhang',
      bio: 'AI researcher exploring the intersection of machine learning and human creativity.',
      extractedInterests: ['Machine Learning', 'AI', 'Research', 'Python', 'Deep Learning'],
      timezone: 'America/Chicago',
    },
    {
      telegramId: '789123456',
      xHandle: 'marketingpro',
      displayName: 'Emma Rodriguez',
      bio: 'Growth marketer helping B2B SaaS companies scale through data-driven strategies.',
      extractedInterests: ['Growth Marketing', 'SaaS', 'Analytics', 'B2B', 'Strategy'],
      timezone: 'Europe/London',
    },
    {
      telegramId: '321654987',
      xHandle: 'blockchaindev',
      displayName: 'David Park',
      bio: 'Blockchain developer building decentralized applications and smart contracts.',
      extractedInterests: ['Blockchain', 'Solidity', 'Web3', 'Ethereum', 'DeFi'],
      timezone: 'Asia/Seoul',
    },
  ]

  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { telegramId: userData.telegramId },
      update: userData,
      create: userData,
    })

    // Create default preferences for each user
    await prisma.userPreferences.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        industries: ['Technology'],
        skills: userData.extractedInterests.slice(0, 3),
        topics: userData.extractedInterests,
        meetingDuration: 30,
        availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        availableHours: { start: '09:00', end: '17:00' },
        notifications: true,
        privacyLevel: 'public',
      },
    })

    console.log(`✅ Created user: ${user.displayName}`)
  }

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

