import { useState, useEffect } from 'react'

const messages = [
  'Analyzing the drip...',
  'Checking color coordination...',
  'Rating the accessories...',
  'Evaluating fit & proportions...',
  'Calculating fire level...',
]

export default function Loading() {
  const [msgIndex, setMsgIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % messages.length)
    }, 1500)
    const progInterval = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 8, 95))
    }, 300)
    return () => { clearInterval(msgInterval); clearInterval(progInterval) }
  }, [])

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6">
      {/* Spinning hanger */}
      <div className="text-6xl mb-8 animate-spin-slow">👔</div>

      {/* Message */}
      <p className="text-white text-lg font-semibold mb-8 h-7 transition-all">
        {messages[msgIndex]}
      </p>

      {/* Progress bar */}
      <div className="w-full max-w-xs h-2 bg-[#2A2A2A] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#8B5CF6] rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-[#A1A1AA] text-xs mt-4">This takes a few seconds</p>
    </div>
  )
}
