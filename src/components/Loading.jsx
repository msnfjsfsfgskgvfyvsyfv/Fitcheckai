import { useState, useEffect } from 'react'

const phase2Messages = [
  'Checking color coordination...',
  'Rating fit & proportions...',
  'Analyzing style cohesion...',
]

export default function Loading({ imagePreview, goal }) {
  const [phase, setPhase] = useState(1)
  const [msgIndex, setMsgIndex] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(2), 2500)
    const t2 = setTimeout(() => setPhase(3), 5000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  useEffect(() => {
    if (phase !== 2) return
    const interval = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setMsgIndex((i) => (i + 1) % phase2Messages.length)
        setFading(false)
      }, 200)
    }, 800)
    return () => clearInterval(interval)
  }, [phase])

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="gradient-bg" />
      <div className="noise-grain" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Phase 1 & 2: Photo with scan line */}
        {phase <= 2 && (
          <div
            className="relative rounded-2xl overflow-hidden border border-white/[0.06] mb-10 shadow-2xl shadow-black/50 transition-all duration-700"
            style={{
              width: phase === 1 ? '13rem' : '10rem',
              height: phase === 1 ? '17rem' : '13rem',
            }}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Your outfit"
                className="w-full h-full object-cover transition-opacity duration-500"
                style={{ opacity: phase === 1 ? 0.5 : 0.35 }}
              />
            ) : (
              <div className="w-full h-full bg-[#111111]" />
            )}
            {/* Lime scan line */}
            <div
              className="absolute left-0 right-0 h-[2px]"
              style={{
                animation: 'scan-line 2.5s ease-in-out infinite alternate',
                background: 'linear-gradient(90deg, transparent, #BFFF00, transparent)',
                boxShadow: '0 0 20px rgba(191, 255, 0, 0.5), 0 0 60px rgba(191, 255, 0, 0.2)',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/20 via-transparent to-[#050505]/70" />
          </div>
        )}

        {/* Phase 3: Empty score ring teaser */}
        {phase === 3 && (
          <div className="mb-10" style={{ animation: 'crossfade-in 0.5s ease-out forwards' }}>
            <svg width="160" height="160" viewBox="0 0 160 160" className="transform -rotate-90" style={{ animation: 'ring-pulse 2s ease-in-out infinite' }}>
              <circle
                cx="80" cy="80" r="65"
                fill="none" stroke="rgba(191, 255, 0, 0.1)" strokeWidth="5"
              />
              <circle
                cx="80" cy="80" r="65"
                fill="none" stroke="rgba(191, 255, 0, 0.25)" strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 65}`}
                strokeDashoffset={`${2 * Math.PI * 65 * 0.7}`}
                style={{ filter: 'drop-shadow(0 0 8px rgba(191, 255, 0, 0.3))' }}
              />
            </svg>
          </div>
        )}

        {/* Goal display */}
        {goal && (
          <p className="text-[#737373] text-sm mb-4 max-w-xs text-center">
            You wanted: <span className="text-[#F5F5F5]/80 italic">'{goal}'</span>
          </p>
        )}

        {/* Status message */}
        <p
          className="text-[#F5F5F5]/90 text-lg font-medium mb-8 h-7 transition-all duration-300"
          style={{ opacity: fading ? 0 : 1, transform: fading ? 'translateY(4px)' : 'translateY(0)' }}
        >
          {phase === 1 && 'Scanning your fit...'}
          {phase === 2 && phase2Messages[msgIndex]}
          {phase === 3 && 'Calculating your score...'}
        </p>

        {/* Progress bar */}
        <div className="w-64 h-1 bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: phase === 1 ? '30%' : phase === 2 ? '65%' : '90%',
              background: 'linear-gradient(90deg, #BFFF00, #8AB800)',
            }}
          />
        </div>

        <p className="text-[#737373]/40 text-xs mt-5">This takes a few seconds</p>
      </div>
    </div>
  )
}
