import { useState, useEffect } from 'react'

const messages = [
  'Scanning your outfit...',
  'Checking color coordination...',
  'Rating fit & proportions...',
  'Analyzing style cohesion...',
  'Calculating your score...',
]

export default function Loading({ imagePreview }) {
  const [msgIndex, setMsgIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setMsgIndex((i) => (i + 1) % messages.length)
        setFading(false)
      }, 200)
    }, 2000)

    const progInterval = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 6 + 1, 95))
    }, 400)

    return () => {
      clearInterval(msgInterval)
      clearInterval(progInterval)
    }
  }, [])

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="gradient-mesh" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Photo with scan line */}
        <div className="relative w-52 h-68 sm:w-60 sm:h-78 rounded-2xl overflow-hidden border border-white/[0.06] mb-10 shadow-2xl shadow-black/50">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Your outfit"
              className="w-full h-full object-cover opacity-50"
            />
          ) : (
            <div className="w-full h-full bg-[#141416]" />
          )}
          {/* Scan line */}
          <div
            className="absolute left-0 right-0 h-[2px]"
            style={{
              animation: 'scan-line 2.5s ease-in-out infinite alternate',
              background: 'linear-gradient(90deg, transparent, #8B5CF6, transparent)',
              boxShadow: '0 0 20px rgba(139, 92, 246, 0.5), 0 0 60px rgba(139, 92, 246, 0.2)',
            }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#09090B]/20 via-transparent to-[#09090B]/70" />
        </div>

        {/* Status message */}
        <p
          className="text-[#FAFAFA]/90 text-lg font-medium mb-8 h-7 transition-all duration-300"
          style={{ opacity: fading ? 0 : 1, transform: fading ? 'translateY(4px)' : 'translateY(0)' }}
        >
          {messages[msgIndex]}
        </p>

        {/* Progress bar */}
        <div className="w-64 h-1 bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #8B5CF6, #A78BFA)',
            }}
          />
        </div>

        <p className="text-[#A1A1AA]/40 text-xs mt-5">This takes a few seconds</p>
      </div>
    </div>
  )
}
