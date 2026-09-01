import Anthropic from '@anthropic-ai/sdk';
import { THY_SYSTEM_PROMPT } from '../constants';

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
});

// Lone surrogate'ları temizler — bunlar JSON UTF-8 encoding'ini kırar
function clean(s: string): string {
  return s.replace(/[\uD800-\uDFFF]/g, (ch, i, str) => {
    const c = ch.charCodeAt(0);
    if (c <= 0xDBFF && str.charCodeAt(i + 1) >= 0xDC00) return ch;
    if (c >= 0xDC00 && i > 0 && str.charCodeAt(i - 1) <= 0xDBFF) return ch;
    return '';
  });
}

export async function generateDescriptions(
  productName: string,
  categoryName: string,
  subcategoryName: string,
  productCode: string,
  imageUrls?: string[],
  extraInfo?: string,
  techSpecs?: string
): Promise<{ tr: string; en: string }> {
  const extraLine = extraInfo?.trim()
    ? `\nExtra context (use this to guide the description): ${clean(extraInfo.trim())}`
    : '';
  const techLine = techSpecs?.trim()
    ? `\nTechnical Specifications (weave naturally into the text): ${clean(techSpecs.trim())}`
    : '';

  const textContent = {
    type: 'text' as const,
    text: `Product Name: ${clean(productName)}
Category: ${clean(categoryName)}
Subcategory: ${clean(subcategoryName)}
Product Code: ${clean(productCode)}${extraLine}${techLine}

Write product descriptions in BOTH Turkish and English for the Turkish Airlines official merchandise store.`,
  };

  const imageBlocks = (imageUrls ?? []).filter(Boolean).map((url) => ({
    type: 'image' as const,
    source: { type: 'url' as const, url: clean(url) },
  }));

  const content = imageBlocks.length > 0
    ? [...imageBlocks, textContent]
    : [textContent];

  let response;
  try {
    response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: THY_SYSTEM_PROMPT,
      messages: [{ role: 'user', content }],
    });
  } catch (err) {
    // Anthropic API hatalarında (özellikle 400) gerçek mesajı yüzeye çıkar
    if (err instanceof Anthropic.APIError) {
      const body = err.error as { error?: { message?: string } } | undefined;
      const detail = body?.error?.message ?? err.message;
      console.error('Anthropic API hatası:', err.status, detail, err);
      throw new Error(`Anthropic ${err.status}: ${detail}`, { cause: err });
    }
    throw err;
  }

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
