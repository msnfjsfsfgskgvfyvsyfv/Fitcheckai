import { useState, useEffect } from 'react'
import { generateShareCard } from '../lib/shareCard'
import { getRemainingChecks } from '../lib/limits'

function getScoreColor(score) {
  if (score >= 9) return '#F59E0B'
  if (score >= 7) return '#22C55E'
  if (score >= 4) return '#EAB308'
  return '#EF4444'
}

function getScoreColorClass(score) {
  if (score >= 9) return 'text-[#F59E0B]'
  if (score >= 7) return 'text-[#22C55E]'
  if (score >= 4) return 'text-[#EAB308]'
  return 'text-[#EF4444]'
}

function getFireEmojis(score) {
  if (score >= 9) return '🔥🔥🔥'
  if (score >= 7) return '🔥🔥'
  if (score >= 5) return '🔥'
  return '💀'
}

export default function Results({ result, onReset }) {
  const [displayScore, setDisplayScore] = useState(0)
  const [phase, setPhase] = useState(0) // 0=ring, 1=label, 2=vibe, 3=details
  const [sharing, setSharing] = useState(false)
  const [bounced, setBounced] = useState(false)
  const remaining = getRemainingChecks()

  const score = result.overall_score
  const color = getScoreColor(score)
  const isGold = score >= 9

  // SVG ring math
  const radius = 90
  const circumference = 2 * Math.PI * radius
  const progress = (score / 10) * circumference

  useEffect(() => {
    // Count-up animation
    const duration = 1200
    const start = Date.now()
    const timer = setInterval(() => {
      const elapsed = Date.now() - start
      const p = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplayScore(+(eased * score).toFixed(1))
      if (p >= 1) {
        clearInterval(timer)
        setBounced(true)
      }
    }, 30)

    // Phase reveals
    const t1 = setTimeout(() => setPhase(1), 1500)
    const t2 = setTimeout(() => setPhase(2), 2000)
    const t3 = setTimeout(() => setPhase(3), 2500)

    return () => {
      clearInterval(timer)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [score])

  async function handleShare() {
    setSharing(true)
    try {
      const dataUrl = await generateShareCard(result)
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

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-8 pb-24">
      {/* Score Ring */}
      <div className={`relative mb-4 ${bounced ? 'animate-score-bounce' : ''}`}>
        <svg width="220" height="220" viewBox="0 0 220 220" className="transform -rotate-90">
          {/* Track */}
          <circle
            cx="110" cy="110" r={radius}
            fill="none" stroke="#27272A" strokeWidth="8"
          />
          {/* Progress */}
          <circle
            cx="110" cy="110" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            style={{
              transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: isGold ? `drop-shadow(0 0 12px ${color}60)` : 'none',
            }}
          />
        </svg>
        {/* Score number centered */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-display text-7xl font-extrabold ${getScoreColorClass(score)}`}>
            {displayScore}
          </span>
        </div>
        {/* Gold shimmer overlay for 9+ */}
        {isGold && (
          <div className="absolute inset-0 rounded-full animate-shimmer pointer-events-none" />
        )}
      </div>

      {/* Fire emojis + label */}
      <div
        className="text-center transition-all duration-400"
        style={{ opacity: phase >= 1 ? 1 : 0, transform: phase >= 1 ? 'translateY(0)' : 'translateY(8px)' }}
      >
        <div className="text-2xl mb-1">{getFireEmojis(score)}</div>
        <div className={`text-xl font-bold ${getScoreColorClass(score)}`}>
          {result.rating_label}
        </div>
      </div>

      {/* Style vibe pill */}
      <div
        className="mt-4 mb-8 transition-all duration-400"
        style={{ opacity: phase >= 2 ? 1 : 0, transform: phase >= 2 ? 'translateY(0)' : 'translateY(8px)' }}
      >
        <span className="bg-[#8B5CF6]/15 text-[#8B5CF6] text-sm font-semibold px-5 py-2 rounded-full">
          {result.style_vibe}
        </span>
      </div>

      {/* Details */}
      {phase >= 3 && (
        <div className="w-full max-w-sm space-y-5">
          {/* Breakdown */}
          <div className="bg-[#141416] rounded-2xl p-5 border border-[#27272A] animate-fade-in-up" style={{ animationDelay: '0ms' }}>
            <h3 className="text-[#FAFAFA] font-bold text-xs uppercase tracking-wider mb-4">Breakdown</h3>
            <div className="space-y-3.5">
              {categories.map(({ label, score: s }, i) => (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-[#A1A1AA]">{label}</span>
                    <span className="text-[#FAFAFA] font-semibold">{s}/10</span>
                  </div>
                  <div className="h-2 bg-[#27272A] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(s / 10) * 100}%`,
                        backgroundColor: getScoreColor(s),
                        animation: `bar-fill 800ms ease-out ${i * 100}ms both`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What's Fire */}
          <div className="bg-[#141416] rounded-2xl p-5 border border-[#27272A] animate-fade-in-up" style={{ animationDelay: '150ms' }}>
            <h3 className="text-[#22C55E] font-bold text-xs uppercase tracking-wider mb-3">What's Fire</h3>
            <ul className="space-y-2">
              {result.whats_fire.map((item, i) => (
                <li key={i} className="text-[#FAFAFA] text-sm flex gap-2">
                  <span className="text-[#22C55E] flex-shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Level Up */}
          <div className="bg-[#141416] rounded-2xl p-5 border border-[#27272A] animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <h3 className="text-[#F59E0B] font-bold text-xs uppercase tracking-wider mb-3">Level Up</h3>
            <ul className="space-y-2">
              {result.what_to_fix.map((item, i) => (
                <li key={i} className="text-[#FAFAFA] text-sm flex gap-2">
                  <span className="text-[#F59E0B] flex-shrink-0">&rarr;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Occasion Match */}
          <div className="bg-[#141416] rounded-2xl p-5 border border-[#27272A] animate-fade-in-up" style={{ animationDelay: '450ms' }}>
            <h3 className="text-[#FAFAFA] font-bold text-xs uppercase tracking-wider mb-3">Works For</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(result.occasion_match).map(([occasion, match]) => (
                <span
                  key={occasion}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                    match
                      ? 'bg-[#22C55E]/12 text-[#22C55E]'
                      : 'bg-[#27272A] text-[#A1A1AA]/50'
                  }`}
                >
                  {match ? '✓' : '✕'} {occasion.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
            <button
              onClick={handleShare}
              disabled={sharing}
              className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-lg py-4 rounded-xl transition-all duration-200 active:scale-[0.97] disabled:opacity-60"
            >
              {sharing ? 'Generating...' : 'Share Your Score'}
            </button>
            <button
              onClick={onReset}
              className="w-full bg-[#141416] hover:bg-[#1C1C1F] text-[#FAFAFA] font-semibold py-3 rounded-xl border border-[#27272A] transition-all duration-200"
            >
              {remaining > 0 ? 'Rate Another Fit' : 'Done for Today'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
