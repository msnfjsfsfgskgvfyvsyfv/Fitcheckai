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
    <div className="flex-1 flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      <div className="gradient-mesh" />

      <div className="relative z-10 flex flex-col items-center w-full">
        {/* Blurred score hint */}
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-full bg-[#8B5CF6]/10 blur-3xl" />
          <svg width="160" height="160" viewBox="0 0 160 160" className="relative transform -rotate-90 opacity-30">
            <circle cx="80" cy="80" r="65" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="5" />
            <circle
              cx="80" cy="80" r="65"
              fill="none" stroke="#8B5CF6" strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 65}`}
              strokeDashoffset={`${2 * Math.PI * 65 * 0.25}`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-4xl font-extrabold text-[#FAFAFA]/15 blur-sm select-none">?.?</span>
          </div>
        </div>

        <h2 className="font-display text-2xl font-bold mb-2">Your Score is Ready</h2>
        <p className="text-[#A1A1AA]/70 mb-8 max-w-sm leading-relaxed">
          You've used your 2 free checks today. Unlock unlimited or come back tomorrow.
        </p>

        <div className="glass-card p-6 w-full max-w-sm mb-6">
          <div className="bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] bg-clip-text text-transparent font-bold text-lg mb-1">FitCheckAI Pro</div>
          <p className="text-[#A1A1AA]/50 text-xs mb-6">Coming soon</p>

          <ul className="text-left space-y-3 text-sm text-[#FAFAFA]/90 mb-6">
            {['Unlimited fit checks', 'Full style breakdown & tips', 'Premium share cards', 'Outfit history & progress'].map((text) => (
              <li key={text} className="flex gap-3 items-start">
                <div className="w-5 h-5 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-[#8B5CF6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                {text}
              </li>
            ))}
          </ul>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-[#FAFAFA] text-sm placeholder-[#A1A1AA]/30 focus:outline-none focus:border-[#8B5CF6]/50 focus:ring-1 focus:ring-[#8B5CF6]/20 transition-all"
                required
              />
              <button
                type="submit"
                className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold py-3.5 rounded-xl transition-all duration-300 active:scale-[0.97] shadow-lg shadow-[#8B5CF6]/20"
              >
                Get Early Access
              </button>
            </form>
          ) : (
            <div className="bg-[#22C55E]/8 border border-[#22C55E]/15 rounded-xl px-4 py-3.5 text-[#22C55E] text-sm">
              You're on the list. We'll email you when Pro launches.
            </div>
          )}
        </div>

        <button
          onClick={() => window.location.reload()}
          className="text-[#A1A1AA]/50 text-sm hover:text-[#FAFAFA]/70 transition-colors duration-300"
        >
          Come back tomorrow for 2 more free checks
        </button>
      </div>
    </div>
  )
}
