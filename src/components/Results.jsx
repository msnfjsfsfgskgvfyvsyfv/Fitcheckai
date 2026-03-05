import { useState, useEffect, useRef } from 'react'
import { generateShareCard } from '../lib/shareCard'
import { getRemainingChecks } from '../lib/limits'

function getScoreColor(score) {
  if (score >= 9) return '#FF6B2B'
  if (score >= 7) return '#BFFF00'
  if (score >= 4) return '#FFD60A'
  return '#FF3B3B'
}

function getScoreColorClass(score) {
  if (score >= 9) return 'text-[#FF6B2B]'
  if (score >= 7) return 'text-[#BFFF00]'
  if (score >= 4) return 'text-[#FFD60A]'
  return 'text-[#FF3B3B]'
}

export default function Results({ result, onReset, goal }) {
  const [displayScore, setDisplayScore] = useState(0)
  const [takeover, setTakeover] = useState(true)
  const [takeoverPhase, setTakeoverPhase] = useState(0) // 0=track, 1=drawing, 2=bounced, 3=label, 4=vibe
  const [showResults, setShowResults] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [particles, setParticles] = useState([])
  const remaining = getRemainingChecks()

  const score = result.overall_score
  const color = getScoreColor(score)
  const isFireScore = score >= 9

  const radius = 90
  const circumference = 2 * Math.PI * radius
  const progress = (score / 10) * circumference

  // Score takeover timeline
  useEffect(() => {
    // 0-100ms: ring track fades in
    const t0 = setTimeout(() => setTakeoverPhase(1), 100)
    // 100-1400ms: ring draws + number counts up
    const duration = 1300
    const start = Date.now() + 100
    const counter = setInterval(() => {
      const elapsed = Date.now() - start
      if (elapsed < 0) return
      const p = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplayScore(+(eased * score).toFixed(1))
      if (p >= 1) clearInterval(counter)
    }, 30)
    // 1400ms: bounce + glow flash
    const t2 = setTimeout(() => {
      setTakeoverPhase(2)
      if (isFireScore) {
        // Create particle burst
        const newParticles = Array.from({ length: 12 }, (_, i) => ({
          id: i,
          angle: (i / 12) * 360,
          distance: 80 + Math.random() * 60,
        }))
        setParticles(newParticles)
      }
    }, 1400)
    // 1700ms: rating label
    const t3 = setTimeout(() => setTakeoverPhase(3), 1700)
    // 2000ms: vibe pill
    const t4 = setTimeout(() => setTakeoverPhase(4), 2000)
    // 2500ms: takeover fades out → scrollable
    const t5 = setTimeout(() => {
      setTakeover(false)
      setTimeout(() => setShowResults(true), 100)
    }, 2500)

    return () => {
      clearInterval(counter)
      clearTimeout(t0); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5)
    }
  }, [score, isFireScore])

  async function handleShare() {
    setSharing(true)
    try {
      const dataUrl = await generateShareCard(result, goal)
      const link = document.createElement('a')
      link.download = `fitcheck-${score}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Share failed:', err)
    }
    setSharing(false)
  }

  const categories = [
    { label: 'Color Coordination', score: result.breakdown.color_coordination },
    { label: 'Fit & Proportions', score: result.breakdown.fit_proportions },
    { label: 'Style Cohesion', score: result.breakdown.style_cohesion },
    { label: 'Accessory Game', score: result.breakdown.accessory_game },
    { label: 'Confidence Factor', score: result.breakdown.confidence_factor },
  ]

  // Full-screen takeover
  if (takeover) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative overflow-hidden">
        <div className="gradient-bg" />
        <div className="noise-grain" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Score Ring */}
          <div className={`relative mb-6 ${takeoverPhase >= 2 ? 'animate-score-bounce' : ''}`}>
            {/* Glow behind ring */}
            <div
              className="absolute inset-0 rounded-full blur-3xl transition-opacity duration-500"
              style={{ backgroundColor: color, opacity: takeoverPhase >= 2 ? 0.25 : 0.1 }}
            />
            {/* Glow flash on bounce */}
            {takeoverPhase >= 2 && (
              <div
                className="absolute inset-[-20px] rounded-full"
                style={{
                  backgroundColor: color,
                  animation: 'glow-flash 0.6s ease-out forwards',
                  filter: 'blur(40px)',
                }}
              />
            )}
            <svg
              width="240" height="240" viewBox="0 0 220 220"
              className="relative transform -rotate-90"
              style={{ opacity: takeoverPhase >= 0 ? 1 : 0, transition: 'opacity 0.3s' }}
            >
              <circle
                cx="110" cy="110" r={radius}
                fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="7"
              />
              <circle
                cx="110" cy="110" r={radius}
                fill="none"
                stroke={color}
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={takeoverPhase >= 1 ? circumference - progress : circumference}
                style={{
                  transition: 'stroke-dashoffset 1.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  filter: `drop-shadow(0 0 10px ${color}50)`,
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`font-display text-8xl font-extrabold ${getScoreColorClass(score)}`}>
                {displayScore}
              </span>
            </div>

            {/* Particle burst for 9+ */}
            {particles.map((p) => (
              <div
                key={p.id}
                className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
                style={{
                  backgroundColor: color,
                  boxShadow: `0 0 6px ${color}`,
                  animation: 'particle-burst 0.8s ease-out forwards',
                  transform: `translate(-50%, -50%) translate(${Math.cos(p.angle * Math.PI / 180) * p.distance}px, ${Math.sin(p.angle * Math.PI / 180) * p.distance}px)`,
                }}
              />
            ))}
          </div>

          {/* Rating label */}
          <div
            className="transition-all duration-500"
            style={{ opacity: takeoverPhase >= 3 ? 1 : 0, transform: takeoverPhase >= 3 ? 'translateY(0)' : 'translateY(8px)' }}
          >
            <div className={`text-2xl font-bold ${getScoreColorClass(score)}`}>
              {result.rating_label}
            </div>
          </div>

          {/* Vibe pill */}
          <div
            className="mt-4 transition-all duration-500"
            style={{ opacity: takeoverPhase >= 4 ? 1 : 0, transform: takeoverPhase >= 4 ? 'translateY(0)' : 'translateY(8px)' }}
          >
            <span className="bg-[#BFFF00]/10 text-[#BFFF00] text-sm font-semibold px-5 py-2 rounded-full border border-[#BFFF00]/15">
              {result.style_vibe}
            </span>
          </div>
        </div>
      </div>
    )
  }

  // Scrollable results
  return (
    <div className="flex-1 flex flex-col items-center px-6 py-8 pb-24 relative overflow-hidden">
      <div className="gradient-bg" />
      <div className="noise-grain" />

      <div className="relative z-10 flex flex-col items-center w-full" style={{ animation: showResults ? 'fade-in 0.5s ease-out forwards' : 'none', opacity: showResults ? undefined : 0 }}>
        {/* Compact score ring */}
        <div className="relative mb-4">
          <div
            className="absolute inset-0 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: color }}
          />
          <svg width="180" height="180" viewBox="0 0 220 220" className="relative transform -rotate-90">
            <circle
              cx="110" cy="110" r={radius}
              fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="7"
            />
            <circle
              cx="110" cy="110" r={radius}
              fill="none"
              stroke={color}
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - progress}
              style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`font-display text-6xl font-extrabold ${getScoreColorClass(score)}`}>
              {score.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Label + Vibe */}
        <div className={`text-xl font-bold mb-2 ${getScoreColorClass(score)}`}>
          {result.rating_label}
        </div>
        <span className="bg-[#BFFF00]/10 text-[#BFFF00] text-sm font-semibold px-5 py-2 rounded-full border border-[#BFFF00]/15 mb-6">
          {result.style_vibe}
        </span>

        {/* Goal context banner */}
        {goal && (
          <div className="w-full max-w-sm glass-card px-4 py-3 mb-4 animate-fade-in-up" style={{ animationDelay: '0ms' }}>
            <p className="text-[#737373] text-xs font-medium uppercase tracking-wider mb-1">Your goal</p>
            <p className="text-[#F5F5F5]/80 text-sm italic">{`\u201C${goal}\u201D`}</p>
          </div>
        )}

        {/* Details */}
        <div className="w-full max-w-sm space-y-4">
          {/* Breakdown */}
          <div className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: '50ms' }}>
            <h3 className="text-[#F5F5F5]/80 font-bold text-[11px] uppercase tracking-[0.15em] mb-4">Breakdown</h3>
            <div className="space-y-3.5">
              {categories.map(({ label, score: s }, i) => (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-[#737373]">{label}</span>
                    <span className="text-[#F5F5F5] font-semibold">{s}/10</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(s / 10) * 100}%`,
                        backgroundColor: getScoreColor(s),
                        animation: `bar-fill 800ms ease-out ${i * 100}ms both`,
                        boxShadow: `0 0 8px ${getScoreColor(s)}30`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What's Fire */}
          <div className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <h3 className="text-[#BFFF00] font-bold text-[11px] uppercase tracking-[0.15em] mb-3">What's Fire</h3>
            <ul className="space-y-2.5">
              {result.whats_fire.map((item, i) => (
                <li key={i} className="text-[#F5F5F5]/90 text-sm flex gap-2.5 leading-relaxed">
                  <span className="text-[#BFFF00] flex-shrink-0 mt-0.5">{'\u2713'}</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Level Up */}
          <div className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: '350ms' }}>
            <h3 className="text-[#FF6B2B] font-bold text-[11px] uppercase tracking-[0.15em] mb-3">Level Up</h3>
            <ul className="space-y-2.5">
              {result.what_to_fix.map((item, i) => (
                <li key={i} className="text-[#F5F5F5]/90 text-sm flex gap-2.5 leading-relaxed">
                  <span className="text-[#FF6B2B] flex-shrink-0 mt-0.5">&rarr;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Works For */}
          <div className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
            <h3 className="text-[#F5F5F5]/80 font-bold text-[11px] uppercase tracking-[0.15em] mb-3">Works For</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(result.occasion_match).map(([occasion, match]) => (
                <span
                  key={occasion}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                    match
                      ? 'bg-[#BFFF00]/8 text-[#BFFF00] border border-[#BFFF00]/15'
                      : 'bg-white/[0.03] text-[#737373]/40 border border-white/[0.04]'
                  }`}
                >
                  {match ? '\u2713' : '\u2715'} {occasion.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-3 animate-fade-in-up" style={{ animationDelay: '650ms' }}>
            <button
              onClick={handleShare}
              disabled={sharing}
              className="w-full bg-[#BFFF00] hover:bg-[#8AB800] text-[#050505] font-bold text-lg py-4 rounded-2xl transition-all duration-300 active:scale-[0.97] disabled:opacity-60 shadow-lg shadow-[#BFFF00]/20"
            >
              {sharing ? 'Generating...' : 'Share Your Score'}
            </button>
            <button
              onClick={onReset}
              className="w-full bg-white/[0.03] hover:bg-white/[0.06] text-[#F5F5F5]/80 font-semibold py-3 rounded-2xl border border-white/[0.06] transition-all duration-300"
            >
              {remaining > 0 ? 'Rate Another Fit' : 'Done for Today'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
