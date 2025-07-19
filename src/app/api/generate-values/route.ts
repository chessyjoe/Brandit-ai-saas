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
          content: "You are a business consultant. Generate core company values for organizations."
        },
        {
          role: "user",
          content: `Generate 5 core company values for: ${prompt}`
        }
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    if (!response.choices || !response.choices[0] || !response.choices[0].message) {
      throw new Error("No values generated from API.");
    }

    const values = response.choices[0].message.content;
    return NextResponse.json({ values });
  } catch (error: unknown) {
    console.error('Error generating values:', error);
    return NextResponse.json(
      { message: 'Values generation failed', error: (error as Error).message },
      { status: 500 }
    );
  }
} 