import { useState } from 'react'

export default function Paywall() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!email) return
    console.log('Pro waitlist email:', email)
    setSubmitted(true)
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
      {/* Blurred score hint */}
      <div className="relative mb-6">
        <svg width="160" height="160" viewBox="0 0 160 160" className="transform -rotate-90 opacity-40">
          <circle cx="80" cy="80" r="65" fill="none" stroke="#27272A" strokeWidth="6" />
          <circle
            cx="80" cy="80" r="65"
            fill="none" stroke="#8B5CF6" strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 65}`}
            strokeDashoffset={`${2 * Math.PI * 65 * 0.25}`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-4xl font-extrabold text-[#FAFAFA]/20 blur-sm select-none">?.?</span>
        </div>
      </div>

      <h2 className="font-display text-2xl font-bold mb-2">Your Score is Ready</h2>
      <p className="text-[#A1A1AA] mb-8 max-w-sm">
        You've used your 2 free checks today. Unlock unlimited access or come back tomorrow.
      </p>

      <div className="bg-[#141416] rounded-2xl p-6 border border-[#27272A] w-full max-w-sm mb-6">
        <div className="text-[#8B5CF6] font-bold text-lg mb-1">FitCheckAI Pro</div>
        <p className="text-[#A1A1AA] text-xs mb-5">Coming soon</p>

        <ul className="text-left space-y-2.5 text-sm text-[#FAFAFA] mb-6">
          <li className="flex gap-2.5 items-start">
            <svg className="w-4 h-4 text-[#8B5CF6] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
            Unlimited fit checks
          </li>
          <li className="flex gap-2.5 items-start">
            <svg className="w-4 h-4 text-[#8B5CF6] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
            Full style breakdown & tips
          </li>
          <li className="flex gap-2.5 items-start">
            <svg className="w-4 h-4 text-[#8B5CF6] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
            Premium share cards
          </li>
          <li className="flex gap-2.5 items-start">
            <svg className="w-4 h-4 text-[#8B5CF6] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
            Outfit history & progress
          </li>
        </ul>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-[#09090B] border border-[#27272A] rounded-xl px-4 py-3 text-[#FAFAFA] text-sm placeholder-[#A1A1AA]/40 focus:outline-none focus:border-[#8B5CF6] transition-colors"
              required
            />
            <button
              type="submit"
              className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold py-3 rounded-xl transition-all duration-200 active:scale-[0.97]"
            >
              Get Early Access
            </button>
          </form>
        ) : (
          <div className="bg-[#22C55E]/10 border border-[#22C55E]/25 rounded-xl px-4 py-3 text-[#22C55E] text-sm">
            You're on the list. We'll email you when Pro launches.
          </div>
        )}
      </div>

      <button
        onClick={() => window.location.reload()}
        className="text-[#A1A1AA] text-sm hover:text-[#FAFAFA] transition-colors duration-200"
      >
        Come back tomorrow for 2 more free checks
      </button>
    </div>
  )
}
