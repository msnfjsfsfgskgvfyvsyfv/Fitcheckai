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

export async function analyzeOutfit(imageBase64, mimeType) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  if (!apiKey || apiKey === 'your-api-key-here') {
    // Return mock data for development
    return getMockResult();
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
              text: 'Rate this outfit.',
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
    // Try to extract JSON from the response
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error('Failed to parse AI response');
  }
}

function getMockResult() {
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
          'The neutral color palette is working — everything flows together',
          'Proportions are on point, the fit looks intentional',
        ],
        what_to_fix: [
          'A simple watch or bracelet would add some dimension',
          'Try swapping the sneakers for leather boots to elevate it',
        ],
        occasion_match: {
          date_night: true,
          school: true,
          job_interview: false,
          hanging_out: true,
          formal_event: false,
        },
      });
    }, 2500);
  });
}
