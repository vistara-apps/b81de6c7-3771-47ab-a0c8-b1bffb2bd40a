import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY,
  baseURL: process.env.OPENAI_API_KEY ? undefined : "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export async function extractInterestsFromProfile(bio: string, recentTweets?: string[]): Promise<string[]> {
  try {
    const content = `
      Analyze this Twitter profile and extract professional interests and skills.

      Bio: ${bio}
      ${recentTweets ? `Recent tweets: ${recentTweets.join(' | ')}` : ''}

      Return a JSON array of 3-8 specific interests/skills that would be relevant for professional networking.
      Focus on: technologies, industries, skills, professional topics, business areas.

      Example format: ["React", "Machine Learning", "Startup Founder", "Product Design", "Fintech"]
    `;

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_API_KEY ? 'gpt-4' : 'google/gemini-2.0-flash-001',
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

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_API_KEY ? 'gpt-4' : 'google/gemini-2.0-flash-001',
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
