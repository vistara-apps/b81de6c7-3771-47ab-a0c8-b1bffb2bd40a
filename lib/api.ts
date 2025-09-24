import OpenAI from 'openai';

let openai: OpenAI | null = null;

function getOpenAIClient() {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
      dangerouslyAllowBrowser: true,
    });
  }
  return openai;
}

export async function extractInterestsFromProfile(bio: string, recentTweets?: string[]): Promise<string[]> {
  const client = getOpenAIClient();
  if (!client) {
    // Fallback when no API key is available
    return ['React', 'TypeScript', 'Product Design', 'Startups', 'AI'];
  }

  try {
    const content = `
      Analyze this Twitter profile and extract professional interests and skills.

      Bio: ${bio}
      ${recentTweets ? `Recent tweets: ${recentTweets.join(' | ')}` : ''}

      Return a JSON array of 3-8 specific interests/skills that would be relevant for professional networking.
      Focus on: technologies, industries, skills, professional topics, business areas.

      Example format: ["React", "Machine Learning", "Startup Founder", "Product Design", "Fintech"]
    `;

    const response = await client.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [{ role: 'user', content }],
      temperature: 0.3,
      max_tokens: 200,
    });

    const result = response.choices[0]?.message?.content;
    if (!result) return [];

    try {
      return JSON.parse(result);
    } catch {
      // Fallback: extract interests from text
      return result
        .split(',')
        .map(interest => interest.trim().replace(/['"]/g, ''))
        .filter(interest => interest.length > 0)
        .slice(0, 8);
    }
  } catch (error) {
    console.error('Error extracting interests:', error);
    return [];
  }
}

export async function generateConversationStarters(
  user1Interests: string[],
  user2Interests: string[]
): Promise<string[]> {
  const client = getOpenAIClient();
  if (!client) {
    // Fallback when no API key is available
    return [
      "What's the most exciting project you're working on right now?",
      "How did you get started in your field?",
      "What's one trend in your industry that you're excited about?",
    ];
  }

  try {
    const commonInterests = user1Interests.filter(interest =>
      user2Interests.includes(interest)
    );

    const content = `
      Generate 3 conversation starters for two professionals meeting for virtual coffee.

      Person 1 interests: ${user1Interests.join(', ')}
      Person 2 interests: ${user2Interests.join(', ')}
      Common interests: ${commonInterests.join(', ')}

      Create engaging, specific questions that help them connect professionally.
      Focus on their shared interests and potential collaboration opportunities.

      Return as JSON array of strings.
    `;

    const response = await client.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [{ role: 'user', content }],
      temperature: 0.7,
      max_tokens: 300,
    });

    const result = response.choices[0]?.message?.content;
    if (!result) return [];

    try {
      return JSON.parse(result);
    } catch {
      return result
        .split('\n')
        .filter(line => line.trim().length > 0)
        .slice(0, 3);
    }
  } catch (error) {
    console.error('Error generating conversation starters:', error);
    return [
      "What's the most exciting project you're working on right now?",
      "How did you get started in your field?",
      "What's one trend in your industry that you're excited about?",
    ];
  }
}

// Mock Twitter API functions (in production, use actual Twitter API)
export async function fetchTwitterProfile(handle: string) {
  // Mock implementation - replace with actual Twitter API
  return {
    id: '123456789',
    username: handle,
    name: 'John Doe',
    description: 'Full-stack developer passionate about React, AI, and building great products. Currently working on fintech solutions.',
    profile_image_url: 'https://pbs.twimg.com/profile_images/example.jpg',
    public_metrics: {
      followers_count: 1250,
      following_count: 890,
      tweet_count: 3420,
    },
  };
}

export async function fetchRecentTweets(userId: string) {
  // Mock implementation - replace with actual Twitter API
  return [
    { text: 'Just shipped a new React component library! The developer experience is amazing.' },
    { text: 'AI is transforming how we build products. Excited about the possibilities.' },
    { text: 'Great networking event today. Love connecting with fellow entrepreneurs!' },
  ];
}
