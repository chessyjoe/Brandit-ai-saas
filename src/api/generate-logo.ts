import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { prompt } = req.body;

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        prompt,
        n: 1,
        size: '512x512',
        response_format: 'url',
      }),
    });

    const data = await openaiRes.json();
    if (!data.data || !data.data[0]?.url) {
      return res.status(500).json({ error: 'No image URL returned from OpenAI.' });
    }
    res.status(200).json({ imageUrl: data.data[0].url });
  } catch {
    res.status(500).json({ error: 'Failed to generate banner.' });
  }
}