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

    const response = await openai.images.generate({
      prompt,
      n: 1,
      size: "1024x1024",
    });

    if (
      !response ||
      !response.data ||
      !Array.isArray(response.data) ||
      !response.data[0] ||
      !response.data[0].url
    ) {
      throw new Error("No image URL returned from API.");
    }

    const imageUrl = response.data[0].url;
    return NextResponse.json({ imageUrl });
  } catch (error: unknown) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { message: 'Image generation failed', error: (error as Error).message },
      { status: 500 }
    );
  }
} 