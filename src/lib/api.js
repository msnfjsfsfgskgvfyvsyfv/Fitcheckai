const SYSTEM_PROMPT = `You are FitCheckAI, an expert fashion analyst. You analyze outfit photos and provide honest, helpful ratings.

INSTRUCTIONS:
- Analyze: clothing items, colors, fit/proportions, accessories, shoes, layering, overall style cohesion
- Rate honestly. A plain white tee and jeans is a 5-6, not a 9. Reserve 9-10 for genuinely impressive outfits.
- Use natural, casual language. Be specific. Not "nice outfit" but "the contrast between the dark denim and white tee is clean."
- Be helpful and fun, not mean. Honest but encouraging.
- Identify the style vibe accurately from: Streetwear, Clean Casual, Dark Academia, Y2K, Minimalist, Prep, Athleisure, Grunge, Old Money, Coastal, Cottagecore, Techwear, Boho, Vintage, Punk, Smart Casual, Business Casual, Formal, Sporty, Edgy
- Suggest realistic improvements. "Add a watch" not "buy a $2,000 jacket."
- Handle ALL genders and styles equally.
- If the photo is blurry, too zoomed in, has no visible outfit, or is not a person: return an error response.

CONTEXT-AWARE RATING:
The user may optionally provide:
- "occasion": where they're going (e.g., "Date night", "School", "Wedding / formal", "Work")
- "vibe": the style they're going for (e.g., "Casual", "Dressy", "Streetwear", "Cozy")

If context is provided, factor it heavily into your rating:
- A hoodie + sweats for "hanging with friends" + "cozy" = score well because it MATCHES the context
- A hoodie + sweats for "date night" + "dressy" = score low because it DOESN'T match
- A full suit for "wedding" + "professional" = score high
- A full suit for "school" + "casual" = call out the mismatch ("you're overdoing it for class")
- Make feedback specific to the occasion: "This is a strong date night look — the fitted jacket says effort without trying too hard."

If NO context is provided, rate on general style merit alone.

SCORING GUIDE:
- 1-3: Major issues (clashing colors, terrible fit, looks thrown together)
- 4-5: Below average (boring, no effort, something's off)
- 6: Average (acceptable but nothing special)
- 7: Good (solid outfit, works well)
- 8: Great (intentional, well-coordinated, strong style)
- 9: Excellent (standout fit, creative, everything works)
- 10: Perfect (rare — genuinely exceptional outfit)

RESPONSE FORMAT — Return ONLY valid JSON, no markdown, no backticks:

For valid outfit photos:
{
  "error": false,
  "overall_score": 7.5,
  "rating_label": "Clean",
  "breakdown": {
    "color_coordination": 8,
    "fit_proportions": 7,
    "style_cohesion": 8,
    "accessory_game": 6,
    "confidence_factor": 8
  },
  "style_vibe": "Streetwear",
  "whats_fire": [
    "Specific positive observation about the outfit",
    "Another specific positive detail"
  ],
  "what_to_fix": [
    "Specific actionable suggestion",
    "Another specific suggestion"
  ],
  "occasion_match": {
    "date_night": true,
    "school": true,
    "job_interview": false,
    "hanging_out": true,
    "formal_event": false
  }
}

Rating labels by score:
- 9-10: "Fire"
- 7-8.9: "Clean"
- 5-6.9: "Mid"
- 1-4.9: "Nah"

For invalid photos (blurry, no outfit, not a person, etc):
{
  "error": true,
  "error_message": "Brief explanation of why the photo can't be rated"
}`;

export async function analyzeOutfit(imageBase64, mimeType, context = {}) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  if (!apiKey || apiKey === 'your-api-key-here') {
    return getMockResult(context);
  }

  // Build the user message with optional context
  let userText = 'Rate this outfit.';
  if (context.occasion || context.vibe) {
    const parts = [];
    if (context.occasion) parts.push(`Occasion: ${context.occasion}`);
    if (context.vibe) parts.push(`Vibe they're going for: ${context.vibe}`);
    userText = `Rate this outfit.\n\nContext:\n${parts.join('\n')}`;
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mimeType,
                data: imageBase64,
              },
            },
            {
              type: 'text',
              text: userText,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error: ${response.status} — ${err}`);
  }

  const data = await response.json();
  const text = data.content[0].text;

  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error('Failed to parse AI response');
  }
}

function getMockResult(context = {}) {
  // Adjust mock based on context for realistic dev testing
  const isCozy = context.vibe === 'Cozy' || context.vibe === 'Casual';
  const isFormal = context.occasion === 'Wedding / formal' || context.occasion === 'Work';

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        error: false,
        overall_score: 7.5,
        rating_label: 'Clean',
        breakdown: {
          color_coordination: 8,
          fit_proportions: 7,
          style_cohesion: 8,
          accessory_game: 6,
          confidence_factor: 8,
        },
        style_vibe: 'Clean Casual',
        whats_fire: [
          context.occasion
            ? `Great choice for ${context.occasion.toLowerCase()} — the outfit matches the vibe`
            : 'The neutral color palette is working — everything flows together',
          'Proportions are on point, the fit looks intentional',
        ],
        what_to_fix: [
          'A simple watch or bracelet would add some dimension',
          context.occasion === 'Date night'
            ? 'Swap the sneakers for leather boots to level this up for date night'
            : 'Try swapping the sneakers for leather boots to elevate it',
        ],
        occasion_match: {
          date_night: true,
          school: true,
          job_interview: false,
          hanging_out: true,
          formal_event: isFormal,
        },
      });
    }, 2500);
  });
}
