import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { message: 'Prompt is required' },
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a creative marketing copywriter. Generate catchy slogans and taglines for businesses."
        },
        {
          role: "user",
          content: `Generate a creative slogan for: ${prompt}`
        }
      ],
      max_tokens: 100,
      temperature: 0.8,
    });

    if (!response.choices || !response.choices[0] || !response.choices[0].message) {
      throw new Error("No slogan generated from API.");
    }

    const slogan = response.choices[0].message.content;
    return NextResponse.json({ slogan });
  } catch (error: unknown) {
    console.error('Error generating slogan:', error);
    return NextResponse.json(
      { message: 'Slogan generation failed', error: (error as Error).message },
      { status: 500 }
    );
  }
} 