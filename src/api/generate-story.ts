import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { prompt } = req.body;

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
      }),
    });

    const data = await openaiRes.json();
    if (!data.choices || !data.choices[0]?.message?.content) {
      return res.status(500).json({ error: 'No story returned from OpenAI.' });
    }
    res.status(200).json({ result: data.choices[0].message.content });
  } catch {
    res.status(500).json({ error: 'Failed to generate banner.' });
  }
}