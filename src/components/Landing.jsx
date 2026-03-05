export default function Landing({ onStart, remaining }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
      {/* Logo */}
      <div className="mb-2 text-5xl">👔</div>
      <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
        <span className="text-white">FitCheck</span>
        <span className="text-[#8B5CF6]">AI</span>
      </h1>

      {/* Hero */}
      <p className="text-xl sm:text-2xl font-semibold text-white mb-3 max-w-md">
        Get Your Fit Rated by AI
      </p>
      <p className="text-[#A1A1AA] text-base sm:text-lg mb-10 max-w-sm">
        Upload your outfit. Get an honest score, style breakdown, and tips to level up.
      </p>

      {/* CTA Button */}
      <button
        onClick={onStart}
        className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-lg px-10 py-4 rounded-2xl transition-all duration-200 animate-pulse-glow active:scale-95"
      >
        Rate My Fit
      </button>

      {/* Free checks */}
      <p className="text-[#A1A1AA] text-sm mt-6">
        {remaining > 0
          ? `${remaining} free fit check${remaining > 1 ? 's' : ''} today. No signup.`
          : "You've used your free checks today."
        }
      </p>

      {/* Example Score Card */}
      <div className="mt-12 w-full max-w-xs">
        <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#2A2A2A]">
          <p className="text-[#A1A1AA] text-xs uppercase tracking-widest mb-3">Example Result</p>
          <div className="text-6xl font-black text-white mb-1">9.2</div>
          <div className="text-[#F59E0B] font-bold text-lg mb-3">🔥 FIRE 🔥</div>
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="bg-[#8B5CF6]/20 text-[#8B5CF6] text-xs font-medium px-3 py-1 rounded-full">Streetwear</span>
            <span className="bg-[#22C55E]/20 text-[#22C55E] text-xs font-medium px-3 py-1 rounded-full">Date Night ✓</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="text-[#A1A1AA]/50 text-xs mt-auto pt-8">
        FitCheckAI — AI-powered outfit ratings
      </p>
    </div>
  )
}
