import Anthropic from '@anthropic-ai/sdk';
import { THY_SYSTEM_PROMPT } from '../constants';

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function generateDescriptions(
  productName: string,
  categoryName: string,
  subcategoryName: string,
  productCode: string,
  imageUrl?: string
): Promise<{ tr: string; en: string }> {
  const textContent = {
    type: 'text' as const,
    text: `Product Name: ${productName}
Category: ${categoryName}
Subcategory: ${subcategoryName}
Product Code: ${productCode}

Write product descriptions in BOTH Turkish and English for the Turkish Airlines official merchandise store.`,
  };

  const content = imageUrl
    ? [
        { type: 'image' as const, source: { type: 'url' as const, url: imageUrl } },
        textContent,
      ]
    : [textContent];

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1000,
    system: THY_SYSTEM_PROMPT,
    messages: [{ role: 'user', content }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';

  // JSON parse with fallback regex
  try {
    return JSON.parse(text);
  } catch {
    const trMatch = text.match(/"tr"\s*:\s*"((?:[^"\\]|\\.)*)"/);
    const enMatch = text.match(/"en"\s*:\s*"((?:[^"\\]|\\.)*)"/);
    if (trMatch && enMatch) {
      return { tr: trMatch[1], en: enMatch[1] };
    }
    throw new Error('AI yanıtı ayrıştırılamadı');
  }
}
