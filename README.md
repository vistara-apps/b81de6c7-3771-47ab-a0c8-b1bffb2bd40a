# CircleUp - Professional Networking Mini App

A Telegram Mini App that matches professionals for virtual coffee chats based on shared interests extracted from their X (Twitter) profiles.

## 🚀 Features

- **X Profile Integration**: Connect your X account to extract professional interests
- **Smart Matching**: AI-powered matching based on shared interests and preferences
- **Frictionless Scheduling**: Easy time slot coordination with timezone support
- **Conversation Starters**: AI-generated icebreakers for meaningful conversations
- **Privacy Controls**: Full control over your data and matching preferences

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **AI**: OpenAI GPT-4 / OpenRouter for interest extraction
- **External APIs**:
  - Twitter/X API v2
  - Telegram Bot API
- **Deployment**: Vercel-ready

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL database
- Twitter/X Developer Account
- Telegram Bot Token
- OpenAI API Key or OpenRouter account

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/b81de6c7-3771-47ab-a0c8-b1bffb2bd40a.git
   cd circleup
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Fill in your environment variables:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/circleup"
   JWT_SECRET="your-super-secret-jwt-key"
   OPENAI_API_KEY="sk-your-openai-api-key"
   TWITTER_CLIENT_ID="your-twitter-client-id"
   TWITTER_CLIENT_SECRET="your-twitter-client-secret"
   TWITTER_BEARER_TOKEN="your-twitter-bearer-token"
   TELEGRAM_BOT_TOKEN="your-telegram-bot-token"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

## 📚 API Documentation

### Authentication

#### POST `/api/auth/user`
Authenticate or create a user account.

**Request Body:**
```json
{
  "telegramId": "string",
  "initData": "string",
  "userData": {
    "displayName": "string",
    "profilePicture": "string"
  }
}
```

**Response:**
```json
{
  "success": true,
  "user": {...},
  "token": "jwt-token"
}
```

### Twitter/X Integration

#### GET `/api/auth/twitter`
Get Twitter OAuth authorization URL.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "authUrl": "https://twitter.com/i/oauth2/authorize?..."
}
```

#### GET `/api/auth/twitter/callback`
Handle Twitter OAuth callback and extract user interests.

### Matches

#### GET `/api/matches`
Get user's matches.

**Query Parameters:**
- `status`: Filter by match status (pending, accepted, scheduled, completed, declined)
- `limit`: Number of matches to return (default: 20)

**Headers:**
```
Authorization: Bearer <jwt-token>
```

#### GET `/api/matches?action=recommendations`
Get personalized match recommendations.

#### POST `/api/matches`
Create a new match request.

**Request Body:**
```json
{
  "targetUserId": "string"
}
```

#### GET `/api/matches?action=mutual-slots&otherUserId=user-id`
Get mutual available time slots for scheduling.

#### PUT `/api/matches/[id]`
Update match status (accept, decline, schedule, complete).

**Request Body:**
```json
{
  "action": "accept" | "decline" | "schedule" | "complete",
  "scheduledTime": "2024-01-01T10:00:00Z",
  "videoCallLink": "https://meet.example.com/room"
}
```

## 🗄️ Database Schema

### User
```sql
- id: String (Primary Key)
- telegramId: String (Unique)
- xProfileUrl: String?
- xHandle: String?
- displayName: String?
- bio: String?
- profilePicture: String?
- extractedInterests: String[]
- timezone: String
- isActive: Boolean
- createdAt: DateTime
- updatedAt: DateTime
```

### Match
```sql
- id: String (Primary Key)
- user1Id: String (Foreign Key)
- user2Id: String (Foreign Key)
- matchScore: Int
- status: MatchStatus
- scheduledTime: DateTime?
- videoCallLink: String?
- conversationStarters: String[]
- createdAt: DateTime
- updatedAt: DateTime
```

### UserPreferences
```sql
- userId: String (Primary Key, Foreign Key)
- industries: String[]
- skills: String[]
- topics: String[]
- meetingDuration: Int
- availableDays: String[]
- availableHours: Json
- notifications: Boolean
- privacyLevel: String
```

## 🎨 Design System

### Colors
- **Primary**: `hsl(210, 70%, 50%)`
- **Accent**: `hsl(160, 60%, 45%)`
- **Background**: `hsl(210, 35%, 95%)`
- **Surface**: `hsl(0, 0%, 100%)`
- **Text Primary**: `hsl(210, 36%, 20%)`
- **Text Secondary**: `hsl(210, 36%, 40%)`

### Typography
- **Display**: `text-xl font-semibold`
- **Body**: `text-base font-normal leading-7`
- **Caption**: `text-sm font-medium`

### Spacing
- **Small**: `8px`
- **Medium**: `12px`
- **Large**: `20px`

## 🚀 Deployment

### Vercel Deployment

1. **Connect your repository to Vercel**
2. **Set environment variables in Vercel dashboard**
3. **Deploy**

### Environment Variables for Production

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-production-jwt-secret"
OPENAI_API_KEY="sk-..."
TWITTER_CLIENT_ID="..."
TWITTER_CLIENT_SECRET="..."
TWITTER_BEARER_TOKEN="..."
TELEGRAM_BOT_TOKEN="..."
NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"
NODE_ENV="production"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@circleup.app or join our Telegram community.

---

Built with ❤️ for the professional networking community.

