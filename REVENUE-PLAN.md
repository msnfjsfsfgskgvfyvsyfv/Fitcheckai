# FitCheckAI Revenue Architecture

## Overview
7 revenue streams designed to scale from $0 to $50K+ MRR. All accounts set up through parent (Apple Dev, Stripe, etc.) since founder is under 18.

---

## Stream 1: iOS App Subscription (PRIMARY)
**The money maker.** Umax proves this model works — they charge $3.99-$9.99/week for AI selfie ratings.

### Pricing Tiers
| Tier | Price | What They Get |
|------|-------|---------------|
| Free | $0 | 2 checks/day, basic score + vibe |
| Pro Weekly | $4.99/week | Unlimited checks, full breakdown, share cards, outfit history |
| Pro Monthly | $12.99/month | Same as weekly (better value positioning) |
| Pro Yearly | $79.99/year | Same + early access to new features |

### Projections (Conservative)
| Month | Free Users | Paid Converts (5%) | MRR |
|-------|-----------|-------------------|-----|
| 1 | 500 | 25 | $325 |
| 3 | 2,000 | 100 | $1,300 |
| 6 | 8,000 | 400 | $5,200 |
| 12 | 25,000 | 1,250 | $16,250 |

### Implementation
- **Tech**: Capacitor to wrap React app → native iOS/Android
- **Payments**: RevenueCat for subscription management (handles App Store + Google Play)
- **Apple Dev Account**: $99/year — parent signs up, adds you as developer
- **Timeline**: 2-3 days to wrap + submit, 1-2 weeks App Store review

### Age Requirements
- Apple Developer Program: 18+ (parent enrolls, you develop)
- RevenueCat: No age restriction on developer accounts
- App Store submission: Parent's account, your app

---

## Stream 2: Web Freemium (ACTIVE NOW)
**Already built.** 2 free checks/day, paywall on limit.

### Pricing (When Pro Launches)
- Free: 2 checks/day
- Web Pro: $9.99/month via Stripe Checkout
- No app download needed — instant access

### Projections
| Month | Web Users | Paid (3%) | MRR |
|-------|----------|----------|-----|
| 3 | 1,000 | 30 | $300 |
| 6 | 3,000 | 90 | $900 |
| 12 | 8,000 | 240 | $2,400 |

### Implementation
- **Payments**: Stripe Checkout (parent's Stripe account, 13+ with parental consent)
- **Auth**: Supabase free tier (email + Google sign-in)
- **Timeline**: 1-2 days to add Stripe + auth

---

## Stream 3: TikTok / Social Media Growth Engine
**Not direct revenue — this is the growth flywheel.** Every viral TikTok = hundreds of free users → paid conversions.

### Strategy
1. Post outfit rating TikToks using FitCheckAI (screen recordings)
2. "Rate my fit" duet challenges
3. Share card designed for Instagram Stories (already built)
4. Link in bio → app download / web app

### Monetization Path
- TikTok Creator Fund: 18+ required (future)
- Brand deals: NO age requirement — brands DM you directly
- At 10K+ followers: $200-500 per sponsored post
- At 100K+: $1,000-5,000 per brand deal

### Projections
| Followers | Brand Deal Value | Deals/Month | Monthly |
|-----------|-----------------|-------------|---------|
| 10K | $300 | 2 | $600 |
| 50K | $1,500 | 3 | $4,500 |
| 100K+ | $3,000 | 4 | $12,000 |

### Timeline
- Start posting immediately (no cost)
- Consistent 1-2 posts/day for 90 days
- Target: 10K followers in 60-90 days

---

## Stream 4: Affiliate Revenue
**Recommend clothes → earn commission when people buy.**

### How It Works
1. AI rates outfit → suggests improvements
2. "Level Up" section includes affiliate links to specific items
3. User clicks "Shop this look" → redirected to retailer
4. Commission on purchase (4-10%)

### Affiliate Programs
| Program | Commission | Cookie | Age Req |
|---------|-----------|--------|---------|
| Amazon Associates | 4% fashion | 24hr | 18+ (parent signs up) |
| ASOS Affiliate | 5-7% | 30 days | 18+ (parent) |
| ShopStyle Collective | 5-15% | 30 days | 18+ (parent) |
| LTK (LikeToKnowIt) | 10-25% | Varies | 18+ (parent) |

### Projections
| Monthly Active Users | Click Rate | Convert Rate | Avg Order | Monthly |
|---------------------|-----------|-------------|-----------|---------|
| 5,000 | 8% | 3% | $60 | $720 |
| 20,000 | 10% | 4% | $65 | $5,200 |
| 50,000 | 12% | 5% | $70 | $21,000 |

### Implementation
- Add "Shop Similar" button to Results page
- Use Amazon Product API to find matching items
- Parent creates affiliate accounts
- Timeline: 3-5 days after core app stable

---

## Stream 5: Premium Share Cards
**One-time purchases for premium visual exports.**

### What Users Get (Free vs Paid)
- **Free**: Basic share card (score + vibe)
- **$1.99**: Premium card (animated, custom backgrounds, no watermark)
- **$4.99**: Card pack (5 premium templates)

### Projections
| Month | Cards Generated | Paid (2%) | Revenue |
|-------|----------------|----------|---------|
| 3 | 3,000 | 60 | $120 |
| 6 | 15,000 | 300 | $600 |
| 12 | 50,000 | 1,000 | $2,000 |

### Implementation
- Already have share card system built
- Add 3-4 premium templates
- Stripe one-time payment or bundle with Pro sub
- Timeline: 1-2 days

---

## Stream 6: Email List → Launches
**Build the list now, monetize later.**

### Strategy
1. Paywall captures emails ("Get Early Access to Pro")
2. Weekly style tips newsletter
3. Launch announcements drive Pro signups
4. Sponsored newsletter slots ($200-1,000 per send at scale)

### Projections
| List Size | Open Rate | Sponsored Send Value |
|-----------|----------|---------------------|
| 1,000 | 40% | $50 |
| 5,000 | 35% | $250 |
| 25,000 | 30% | $1,500 |

### Implementation
- Already capturing emails on Paywall
- Add Mailchimp/Resend for automated sequences
- Timeline: 2 hours to connect

---

## Stream 7: API Access (Future — Month 6+)
**Let other developers use FitCheckAI's rating engine.**

### Pricing
- Free: 100 requests/month
- Developer: $29/month (1,000 requests)
- Business: $99/month (10,000 requests)
- Enterprise: Custom

### Use Cases
- Fashion e-commerce sites (outfit recommendations)
- Dating apps (profile photo optimization)
- Virtual closet apps (outfit scoring)

### Projections (Month 6-12)
| Tier | Customers | MRR |
|------|----------|-----|
| Developer | 20 | $580 |
| Business | 5 | $495 |
| Total | 25 | $1,075 |

### Implementation
- Wrap existing analysis function in API endpoint
- Add rate limiting + API key management
- Deploy on Cloudflare Workers or Vercel Edge
- Timeline: 2-3 days

---

## Combined Revenue Projections

### Conservative Scenario
| Month | Subs (iOS+Web) | Affiliate | TikTok | Other | Total MRR |
|-------|----------------|----------|--------|-------|-----------|
| 1 | $325 | $0 | $0 | $0 | $325 |
| 3 | $1,600 | $200 | $300 | $120 | $2,220 |
| 6 | $6,100 | $2,000 | $2,000 | $900 | $11,000 |
| 12 | $18,650 | $8,000 | $6,000 | $3,075 | $35,725 |

### Aggressive Scenario (Viral TikTok + App Store Feature)
| Month | Total MRR |
|-------|-----------|
| 3 | $8,000 |
| 6 | $25,000 |
| 12 | $75,000+ |

---

## Launch Priority Order

### Phase 1: NOW (Week 1-2)
1. Ship iOS app via Capacitor (parent's Apple Dev account)
2. Start posting TikToks daily
3. Connect email capture to Mailchimp

### Phase 2: GROWTH (Week 3-6)
4. Add Stripe web payments
5. Set up Amazon Associates (through parent)
6. Premium share card templates

### Phase 3: SCALE (Month 2-3)
7. Affiliate integration in results
8. Newsletter sponsorships
9. API access beta

### Phase 4: EXPAND (Month 4-6)
10. Android app (Google Play)
11. Full API launch
12. Brand partnership outreach

---

## Age Requirement Summary

| Service | Min Age | Workaround |
|---------|---------|------------|
| Apple Developer | 18 | Parent enrolls, you develop |
| Stripe | 13 (with parent) | Parent's account |
| RevenueCat | None | Direct signup |
| Amazon Associates | 18 | Parent's account |
| TikTok Creator Fund | 18 | Wait / brand deals instead |
| AdSense | 18 | Parent's account ($2-4 RPM, low priority) |
| Mailchimp | 18 | Parent's account |

**Bottom line**: Everything runs through parent's accounts. You build, they sign. Standard for teen founders.
