# CircleUp - Professional Coffee Connections

Serendipitous professional connections, brewed over virtual coffee.

## Overview

CircleUp is a Base Mini App that matches professionals for virtual coffee chats based on shared interests extracted from their X (Twitter) profiles. Built with Next.js 15, MiniKit, and OnchainKit.

## Features

- **X Profile Integration**: Connect your X account to extract professional interests using AI
- **Smart Matching**: Get matched with professionals based on shared interests and preferences
- **Frictionless Scheduling**: Easy scheduling with timezone awareness and calendar integration
- **Conversation Starters**: AI-generated icebreakers based on common interests
- **Privacy Controls**: Full control over your data and matching preferences

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Blockchain**: Base network via MiniKit and OnchainKit
- **Styling**: Tailwind CSS with custom design system
- **AI**: OpenAI/OpenRouter for interest extraction and conversation starters
- **APIs**: Twitter API for profile data, Telegram Bot API for notifications

## Getting Started

1. **Clone and install dependencies**:
   ```bash
   git clone <repository-url>
   cd circleup-miniapp
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your API keys for MiniKit, OnchainKit, OpenAI, and Twitter.

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open in Base App or compatible Farcaster client**

## Environment Variables

- `NEXT_PUBLIC_MINIKIT_API_KEY`: Your MiniKit API key
- `NEXT_PUBLIC_ONCHAINKIT_API_KEY`: Your OnchainKit API key  
- `OPENAI_API_KEY`: OpenAI/OpenRouter API key for AI features
- `TWITTER_API_KEY`: Twitter API key for profile integration
- `TWITTER_API_SECRET`: Twitter API secret
- `TELEGRAM_BOT_TOKEN`: Telegram bot token for notifications

## Architecture

### Data Models

- **User**: Profile information, interests, preferences, timezone
- **Match**: Connection between two users with status and scheduling info
- **Interest**: Extracted professional interests with categories and confidence scores

### Key Components

- **ProfileCard**: Display user profiles with interests and actions
- **MatchButton**: Handle match requests and responses
- **SchedulingPicker**: Timezone-aware meeting scheduler
- **ChatInput**: Messaging with conversation starter suggestions

### API Integration

- **Interest Extraction**: Uses OpenAI to analyze X profiles and extract professional interests
- **Conversation Starters**: AI-generated icebreakers based on common interests
- **Twitter API**: Fetches profile data and recent tweets for analysis
- **Telegram API**: Sends notifications and manages Mini App interface

## Business Model

**Micro-transactions**: Pay-per-match or metered access
- 5 matches for $1
- Unlimited matches for $5/month
- Premium features: advanced filters, priority matching, profile insights

## Development

### Project Structure
```
app/                 # Next.js App Router pages
components/          # Reusable UI components
lib/                # Utilities, types, and API functions
public/             # Static assets
```

### Key Features Implementation

1. **X Profile Integration**: OAuth flow → profile scraping → AI interest extraction
2. **Smart Matching**: Interest similarity scoring with user preferences
3. **Scheduling**: Timezone-aware calendar integration with video call links
4. **Conversation Starters**: Context-aware AI-generated icebreakers

### Design System

- **Colors**: Professional blue/green palette with accent colors
- **Typography**: Clean, readable fonts optimized for mobile
- **Components**: Modular, reusable components with consistent styling
- **Motion**: Subtle animations with cubic-bezier easing

## Deployment

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Deploy to your preferred platform** (Vercel, Netlify, etc.)

3. **Configure your Mini App manifest** for Base App discovery

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or support, please open an issue or contact the development team.
