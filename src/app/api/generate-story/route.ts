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
          content: "You are a brand storyteller. Create compelling brand stories and narratives for companies."
        },
        {
          role: "user",
          content: `Generate a brand story for: ${prompt}`
        }
      ],
      max_tokens: 300,
      temperature: 0.8,
    });

    if (!response.choices || !response.choices[0] || !response.choices[0].message) {
      throw new Error("No brand story generated from API.");
    }

    const story = response.choices[0].message.content;
    return NextResponse.json({ story });
  } catch (error: unknown) {
    console.error('Error generating brand story:', error);
    return NextResponse.json(
      { message: 'Brand story generation failed', error: (error as Error).message },
      { status: 500 }
    );
  }
} 