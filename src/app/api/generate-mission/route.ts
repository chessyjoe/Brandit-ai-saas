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
          content: "You are a business consultant. Generate compelling mission statements for companies."
        },
        {
          role: "user",
          content: `Generate a mission statement for: ${prompt}`
        }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    if (!response.choices || !response.choices[0] || !response.choices[0].message) {
      throw new Error("No mission statement generated from API.");
    }

    const mission = response.choices[0].message.content;
    return NextResponse.json({ mission });
  } catch (error: unknown) {
    console.error('Error generating mission statement:', error);
    return NextResponse.json(
      { message: 'Mission statement generation failed', error: (error as Error).message },
      { status: 500 }
    );
  }
} 