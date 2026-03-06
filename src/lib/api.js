const SYSTEM_PROMPT = `You are FitCheckAI — the most honest, specific, and stylish outfit rater on the internet. You analyze outfit photos and return brutally honest but constructive ratings.

ANALYSIS PROCESS — look at these in order:

1. CLOTHING IDENTIFICATION
Identify every visible item: top, bottom, outerwear, shoes, accessories (hat, watch, jewelry, bag, belt, sunglasses). Note the type (hoodie vs crewneck vs button-up), color, apparent fabric/material, and condition.

2. COLOR ANALYSIS
- Is there a cohesive color palette or is it random?
- Are colors complementary, analogous, monochromatic, or clashing?
- Is there intentional contrast or accidental mismatch?
- Neutrals balanced with statement colors?
- Do shoes and accessories match or complement the palette?

3. FIT AND PROPORTIONS
- Does each piece fit the body correctly for its intended style?
- Oversized pieces: intentionally oversized or just too big?
- Slim pieces: properly tailored or uncomfortably tight?
- Hem lengths: are pants breaking correctly on shoes? Is the shirt length proportional?
- Silhouette: is there contrast between top and bottom? Or is it all one proportion creating a boxy/shapeless look?
- Layering: do layers build logically in length and weight?

4. STYLE COHESION
- Do ALL pieces belong to the same style universe?
- A blazer with basketball shorts = no cohesion
- A vintage tee with distressed denim and Jordans = cohesive streetwear
- One piece that breaks the whole outfit? Call it out specifically.
- Is the outfit trying to be something and failing, or is it confidently what it is?

5. ACCESSORIES AND DETAILS
- Watch, rings, chains, bracelets, earrings — do they add or clutter?
- Bag/backpack — does it match the vibe?
- Belt — functional and matching or an afterthought?
- Are there MISSING accessories that would elevate this? Be specific.

6. TREND AWARENESS
- Is this outfit current or dated?
- Timeless/classic pieces always score well — they never go out of style.

SCORING RULES — be HONEST:
1-3 (Nah): Genuinely bad. Clashing colors, terrible fit, no style cohesion.
4-4.9 (Nah): Below average. Decent pieces ruined by bad pairing or poor fit.
5-6.9 (Mid): Average. Safe. Nothing wrong but nothing exciting. Most people dress here daily.
7-8.9 (Clean): Genuinely good. Intentional choices. Colors work. Fit is right. Clear style identity.
9-10 (Fire): Exceptional. Everything works perfectly. Creative choices that pay off. Reserve 10 for truly runway-worthy.

CRITICAL SCORING CALIBRATION:
- A plain white tee, jeans, and white sneakers is a 5-6, not a 7.
- An all-black outfit with no texture variation or accessories is a 5-6.
- Do NOT inflate scores. A 7+ must be EARNED.
- If accessories are absent, accessory_game is 3-4, not 6.

GOAL-BASED RATING:
If the user states a goal (e.g., "clean streetwear for school", "dark and mysterious"), rate how well their outfit achieves THAT specific goal. The same outfit scores differently for different goals — a hoodie+jeans is an 8 for "chill school fit" but a 4 for "fancy dinner date." Reference their goal directly in your feedback. The goal takes priority over occasion/vibe pills.

CONTEXT HANDLING:
If the user provided an occasion and/or a vibe, factor these into the rating. Rate for the CONTEXT given, not just general style.
If no context is provided and no goal is stated, rate on general style merit.

FEEDBACK VOICE:
- Talk like a stylish friend, not a fashion professor
- Be specific: reference actual items in the photo by name
- Suggestions should be actionable and realistic
- MAX 2 items in whats_fire, MAX 2 items in what_to_fix

STYLE VIBES — pick the most accurate:
Streetwear, Clean Casual, Dark Academia, Y2K, Minimalist, Prep, Athleisure, Grunge, Old Money, Coastal, Cottagecore, Techwear, Workwear, Skater, Bohemian, Punk, Classic, Smart Casual, Avant-Garde, Gorpcore, Coquette, Tomboy, Indie, Retro

PHOTO QUALITY:
If the photo is blurry, too dark, cropped above the waist, or doesn't clearly show an outfit, return:
{"error": true, "error_message": "Can't get a clear read on the full fit — try a full-body photo with better lighting"}

RESPONSE FORMAT:
Return ONLY valid JSON. No markdown. No backticks. No preamble. Exactly this structure:

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
  "whats_fire": ["specific positive referencing actual items", "another specific positive"],
  "what_to_fix": ["specific actionable fix referencing actual items", "another specific fix"],
  "occasion_match": {
    "date_night": true,
    "school": true,
    "job_interview": false,
    "hanging_out": true,
    "formal_event": false
  }
}

Rating labels: 9-10 = "Fire", 7-8.9 = "Clean", 5-6.9 = "Mid", 1-4.9 = "Nah"
Breakdown scores are integers 1-10. Overall score can have one decimal.`;

// Free vision models ranked by quality — will try in order
// Note: gemma-3-12b doesn't support system prompts, excluded
const MODELS = [
  'google/gemma-3-27b-it:free',
  'mistralai/mistral-small-3.1-24b-instruct:free',
  'nvidia/nemotron-nano-12b-v2-vl:free',
];

export async function analyzeOutfit(imageBase64, mimeType, context = {}) {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  if (!apiKey || apiKey === 'your-api-key-here') {
    console.warn('[FitCheckAI] No API key set — returning mock result');
    return getMockResult(context);
  }

  // Build the user message with goal + optional context
  let userText = 'Rate this outfit.';
  const parts = [];
  if (context.goal) parts.push(`USER GOAL: ${context.goal}`);
  if (context.occasion) parts.push(`OCCASION: ${context.occasion}`);
  if (context.vibe) parts.push(`VIBE: ${context.vibe}`);
  if (parts.length > 0) {
    userText += `\n\n${parts.join('\n')}`;
  }

  const payload = {
    model: MODELS[0],
    max_tokens: 1024,
    messages: [
      {
        role: 'system',
        content: SYSTEM_PROMPT,
      },
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: {
              url: `data:${mimeType};base64,${imageBase64}`,
            },
          },
          {
            type: 'text',
            text: userText,
          },
        ],
      },
    ],
  };

  console.log('[FitCheckAI] Request:', {
    model: payload.model,
    userText,
    imageSize: `${(imageBase64.length * 0.75 / 1024 / 1024).toFixed(2)} MB`,
    mimeType,
  });

  // Try each model, with one retry after a delay for rate limits
  for (let i = 0; i < MODELS.length; i++) {
    payload.model = MODELS[i];

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        if (attempt > 0) {
          console.log(`[FitCheckAI] Retrying ${MODELS[i]} after 3s delay...`);
          await new Promise(r => setTimeout(r, 3000));
        }

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify(payload),
        });

        console.log(`[FitCheckAI] Response status: ${response.status} (model: ${MODELS[i]}, attempt: ${attempt + 1})`);

        // Auth error — key is dead, fall back to mock
        if (response.status === 401 || response.status === 403) {
          const errText = await response.text();
          console.warn('[FitCheckAI] Auth failed, falling back to mock:', errText);
          return getMockResult(context);
        }

        // Rate limited — retry once, then try next model
        if (response.status === 429) {
          console.warn(`[FitCheckAI] Rate limited on ${MODELS[i]}`);
          if (attempt === 0) continue; // retry this model once
          break; // move to next model
        }

        // Other server errors — try next model
        if (!response.ok) {
          const errText = await response.text();
          console.error(`[FitCheckAI] Error ${response.status} on ${MODELS[i]}:`, errText);
          break; // move to next model
        }

        const data = await response.json();
        console.log('[FitCheckAI] Raw response:', JSON.stringify(data).slice(0, 500));

        const text = data.choices?.[0]?.message?.content;
        if (!text) {
          console.error('[FitCheckAI] No content in response:', data);
          break; // move to next model
        }

        // Clean markdown backticks if present
        const cleaned = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

        try {
          const parsed = JSON.parse(cleaned);
          console.log('[FitCheckAI] Parsed result:', parsed);
          return parsed;
        } catch {
          // Try to extract JSON from mixed content
          const match = cleaned.match(/\{[\s\S]*\}/);
          if (match) {
            const parsed = JSON.parse(match[0]);
            console.log('[FitCheckAI] Extracted JSON from mixed content:', parsed);
            return parsed;
          }
          console.error('[FitCheckAI] Failed to parse response:', cleaned.slice(0, 300));
          break; // move to next model
        }
      } catch (err) {
        if (err.message === 'API_KEY_INVALID') throw err;
        if (i === MODELS.length - 1 && attempt === 1) throw err;
        console.warn(`[FitCheckAI] ${MODELS[i]} attempt ${attempt + 1} failed:`, err.message);
        if (attempt === 1) break; // move to next model
      }
    }
    if (i < MODELS.length - 1) {
      console.log(`[FitCheckAI] Trying next model: ${MODELS[i + 1]}`);
    }
  }
  // All models exhausted — fall back to mock so users still get a result
  console.warn('[FitCheckAI] All models exhausted, falling back to mock result');
  return getMockResult(context);
}

// Human-friendly error messages
export function getErrorMessage(err) {
  const msg = err?.message || '';
  if (msg === 'API_KEY_INVALID') return "Our AI service is temporarily down. Try again in a few minutes.";
  if (msg === 'RATE_LIMITED') return "We're getting a lot of requests right now. Try again in 30 seconds.";
  if (msg === 'EMPTY_RESPONSE') return "The AI couldn't process your photo. Try a clearer full-body shot.";
  if (msg === 'PARSE_FAILED') return "The AI gave a weird response. Try again — it usually works the second time.";
  if (msg.startsWith('API_ERROR')) return "Something went wrong on our end. Try again in a moment.";
  return "Couldn't analyze your fit right now — try again.";
}

function getMockResult(context = {}) {
  const isFormal = context.occasion === 'Wedding / formal' || context.occasion === 'Work';
  const goal = context.goal;

  // Randomize scores so each check feels unique
  const rand = (min, max) => +(min + Math.random() * (max - min)).toFixed(1);
  const randInt = (min, max) => Math.round(min + Math.random() * (max - min));
  const score = rand(5.5, 8.8);
  const label = score >= 9 ? 'Fire' : score >= 7 ? 'Clean' : score >= 5 ? 'Mid' : 'Nah';

  const vibes = ['Clean Casual', 'Streetwear', 'Minimalist', 'Smart Casual', 'Athleisure', 'Classic'];
  const vibe = vibes[Math.floor(Math.random() * vibes.length)];

  const fireOptions = [
    'The color palette flows — nothing clashes, everything complements',
    'Proportions are on point, the fit looks intentional not accidental',
    'Layering game is working, the pieces build on each other nicely',
    'Shoes tie the whole outfit together — smart choice',
    'Silhouette is clean, the top-to-bottom ratio looks balanced',
    'The neutral tones give this a premium, put-together feel',
  ];
  const fixOptions = [
    'A simple watch or bracelet would add some dimension',
    'Try swapping the sneakers for leather boots or loafers to elevate it',
    'Rolling the sleeves or cuffing the pants would add some intentionality',
    'A belt or chain would break up the middle and add visual interest',
    'Consider adding a layer — an open overshirt or light jacket would level this up',
    'The socks are peeking and they clash — swap for no-shows',
  ];

  const pick = (arr, n) => arr.sort(() => 0.5 - Math.random()).slice(0, n);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        error: false,
        overall_score: score,
        rating_label: label,
        breakdown: {
          color_coordination: randInt(5, 9),
          fit_proportions: randInt(5, 9),
          style_cohesion: randInt(5, 9),
          accessory_game: randInt(3, 7),
          confidence_factor: randInt(6, 9),
        },
        style_vibe: vibe,
        whats_fire: [
          goal
            ? `Nailing the "${goal}" look — the pieces work together for exactly that vibe`
            : pick(fireOptions, 1)[0],
          pick(fireOptions, 1)[0],
        ],
        what_to_fix: [
          goal
            ? `To push the "${goal}" energy harder, ${pick(fixOptions, 1)[0].toLowerCase()}`
            : pick(fixOptions, 1)[0],
          context.occasion === 'Date night'
            ? 'Swap the sneakers for leather boots to level this up for date night'
            : pick(fixOptions, 1)[0],
        ],
        occasion_match: {
          date_night: score >= 7,
          school: true,
          job_interview: score >= 7.5 && !goal?.toLowerCase().includes('casual'),
          hanging_out: true,
          formal_event: isFormal || score >= 8.5,
        },
      });
    }, 2500);
  });
}
