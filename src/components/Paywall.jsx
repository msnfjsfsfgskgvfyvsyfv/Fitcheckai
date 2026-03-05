import { useState } from 'react'

export default function Paywall() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!email) return
    // TODO: Connect to email collection service
    console.log('Pro waitlist email:', email)
    setSubmitted(true)
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
      <div className="text-5xl mb-6">🔒</div>

      <h2 className="text-2xl font-bold mb-2">Daily Limit Reached</h2>
      <p className="text-[#A1A1AA] mb-8 max-w-sm">
        You've used your 2 free fit checks today. Come back tomorrow, or get unlimited access with Pro.
      </p>

      <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#2A2A2A] w-full max-w-sm mb-6">
        <div className="text-[#8B5CF6] font-bold text-lg mb-4">FitCheckAI Pro</div>
        <ul className="text-left space-y-2 text-sm text-white mb-6">
          <li className="flex gap-2"><span className="text-[#8B5CF6]">✓</span> Unlimited fit checks</li>
          <li className="flex gap-2"><span className="text-[#8B5CF6]">✓</span> Detailed style recommendations</li>
          <li className="flex gap-2"><span className="text-[#8B5CF6]">✓</span> Outfit history & progress</li>
          <li className="flex gap-2"><span className="text-[#8B5CF6]">✓</span> Side-by-side comparisons</li>
        </ul>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white text-sm placeholder-[#A1A1AA]/50 focus:outline-none focus:border-[#8B5CF6]"
              required
            />
            <button
              type="submit"
              className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold py-3 rounded-xl transition-all"
            >
              Get Early Access
            </button>
          </form>
        ) : (
          <div className="bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-xl px-4 py-3 text-[#22C55E] text-sm">
            You're on the list. We'll email you when Pro launches.
          </div>
        )}

        <p className="text-[#A1A1AA]/50 text-xs mt-3">Coming Soon</p>
      </div>

      <button
        onClick={() => window.location.reload()}
        className="text-[#A1A1AA] text-sm hover:text-white transition"
      >
        ← Back to Home
      </button>
    </div>
  )
}
