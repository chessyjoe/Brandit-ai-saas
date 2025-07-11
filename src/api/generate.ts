// pages/api/generate.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required' });
  }

  try {
    // You can adjust n or size here as needed
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
    res.status(200).json({ imageUrl });
  } catch (error: unknown) {
    console.error('Error generating image:', error);
    res.status(500).json({ message: 'Image generation failed', error: (error as Error).message });
  }
}
