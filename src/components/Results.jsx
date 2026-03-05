import { useState, useEffect } from 'react'
import { generateShareCard } from '../lib/shareCard'
import { getRemainingChecks } from '../lib/limits'

function ScoreColor({ score }) {
  if (score >= 9) return 'text-[#F59E0B]'
  if (score >= 7) return 'text-[#22C55E]'
  if (score >= 4) return 'text-[#EAB308]'
  return 'text-[#EF4444]'
}

function BarColor(score) {
  if (score >= 9) return '#F59E0B'
  if (score >= 7) return '#22C55E'
  if (score >= 4) return '#EAB308'
  return '#EF4444'
}

function FireEmojis({ score }) {
  if (score >= 9) return '🔥🔥🔥'
  if (score >= 7) return '🔥🔥'
  if (score >= 5) return '🔥'
  return '💀'
}

export default function Results({ result, onReset }) {
  const [displayScore, setDisplayScore] = useState(0)
  const [showDetails, setShowDetails] = useState(false)
  const [sharing, setSharing] = useState(false)
  const remaining = getRemainingChecks()

  useEffect(() => {
    // Count-up animation
    const target = result.overall_score
    const duration = 1200
    const start = Date.now()
    const timer = setInterval(() => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayScore(+(eased * target).toFixed(1))
      if (progress >= 1) clearInterval(timer)
    }, 30)

    setTimeout(() => setShowDetails(true), 800)
    return () => clearInterval(timer)
  }, [result])

  async function handleShare() {
    setSharing(true)
    try {
      const dataUrl = await generateShareCard(result)
      const link = document.createElement('a')
      link.download = `fitcheck-${result.overall_score}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Share failed:', err)
    }
    setSharing(false)
  }

  const { breakdown } = result
  const categories = [
    { label: 'Color Coordination', score: breakdown.color_coordination },
    { label: 'Fit & Proportions', score: breakdown.fit_proportions },
    { label: 'Style Cohesion', score: breakdown.style_cohesion },
    { label: 'Accessory Game', score: breakdown.accessory_game },
    { label: 'Confidence Factor', score: breakdown.confidence_factor },
  ]

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-8 pb-24">
      {/* Score */}
      <div className="animate-count-up mb-2">
        <div className={`text-7xl sm:text-8xl font-black ${ScoreColor({ score: result.overall_score })}`}>
          {displayScore}
        </div>
      </div>
      <div className="text-3xl mb-1">{FireEmojis({ score: result.overall_score })}</div>
      <div className={`text-2xl font-bold mb-6 ${ScoreColor({ score: result.overall_score })}`}>
        {result.rating_label}
      </div>

      {/* Style Vibe */}
      <span className="bg-[#8B5CF6]/20 text-[#8B5CF6] text-sm font-semibold px-5 py-2 rounded-full mb-8">
        {result.style_vibe}
      </span>

      {showDetails && (
        <div className="w-full max-w-sm space-y-6 animate-fade-in">
          {/* Breakdown bars */}
          <div className="bg-[#1A1A1A] rounded-2xl p-5 border border-[#2A2A2A]">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Breakdown</h3>
            <div className="space-y-4">
              {categories.map(({ label, score }) => (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#A1A1AA]">{label}</span>
                    <span className="text-white font-semibold">{score}/10</span>
                  </div>
                  <div className="h-2 bg-[#2A2A2A] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${(score / 10) * 100}%`,
                        backgroundColor: BarColor(score),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What's Fire */}
          <div className="bg-[#1A1A1A] rounded-2xl p-5 border border-[#2A2A2A]">
            <h3 className="text-[#22C55E] font-bold text-sm uppercase tracking-wider mb-3">What's Fire</h3>
            <ul className="space-y-2">
              {result.whats_fire.map((item, i) => (
                <li key={i} className="text-white text-sm flex gap-2">
                  <span className="text-[#22C55E] flex-shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* What To Fix */}
          <div className="bg-[#1A1A1A] rounded-2xl p-5 border border-[#2A2A2A]">
            <h3 className="text-[#F59E0B] font-bold text-sm uppercase tracking-wider mb-3">Level Up</h3>
            <ul className="space-y-2">
              {result.what_to_fix.map((item, i) => (
                <li key={i} className="text-white text-sm flex gap-2">
                  <span className="text-[#F59E0B] flex-shrink-0">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Occasion Match */}
          <div className="bg-[#1A1A1A] rounded-2xl p-5 border border-[#2A2A2A]">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-3">Works For</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(result.occasion_match).map(([occasion, match]) => (
                <span
                  key={occasion}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                    match
                      ? 'bg-[#22C55E]/15 text-[#22C55E]'
                      : 'bg-[#2A2A2A] text-[#A1A1AA]/50'
                  }`}
                >
                  {match ? '✓' : '✕'} {occasion.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleShare}
              disabled={sharing}
              className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-lg py-4 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-60"
            >
              {sharing ? 'Generating...' : 'Share Your Score'}
            </button>
            <button
              onClick={onReset}
              className="w-full bg-[#1A1A1A] hover:bg-[#222] text-white font-semibold py-3 rounded-2xl border border-[#2A2A2A] transition-all"
            >
              {remaining > 0 ? 'Rate Another Fit' : 'Done for Today'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
