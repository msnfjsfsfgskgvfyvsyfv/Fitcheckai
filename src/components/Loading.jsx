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
    <div className="flex-1 flex flex-col items-center justify-center px-6">
      {/* Photo with scan line */}
      <div className="relative w-56 h-72 sm:w-64 sm:h-80 rounded-2xl overflow-hidden border border-[#27272A] mb-8">
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Your outfit"
            className="w-full h-full object-cover opacity-60"
          />
        ) : (
          <div className="w-full h-full bg-[#141416]" />
        )}
        {/* Scan line */}
        <div
          className="absolute left-0 right-0 h-0.5 bg-[#8B5CF6] shadow-[0_0_12px_rgba(139,92,246,0.6)]"
          style={{
            animation: 'scan-line 2s ease-in-out infinite alternate',
          }}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#09090B]/60" />
      </div>

      {/* Status message with crossfade */}
      <p
        className="text-[#FAFAFA] text-lg font-semibold mb-8 h-7 transition-all duration-200"
        style={{ opacity: fading ? 0 : 1, transform: fading ? 'translateY(4px)' : 'translateY(0)' }}
      >
        {messages[msgIndex]}
      </p>

      {/* Progress bar */}
      <div className="w-full max-w-xs h-1.5 bg-[#27272A] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#8B5CF6] rounded-full transition-all duration-400 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-[#A1A1AA] text-xs mt-4">This takes a few seconds</p>
    </div>
  )
}
