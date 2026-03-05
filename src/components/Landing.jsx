export default function Landing({ onStart, remaining }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
      {/* Brand */}
      <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
        <span className="text-[#FAFAFA]">FITCHECK</span>
        <span className="text-[#8B5CF6]">AI</span>
      </h1>

      {/* Hero */}
      <p className="text-xl sm:text-2xl font-semibold text-[#FAFAFA] mb-3 max-w-md">
        Rate Your Fit.
      </p>
      <p className="text-[#A1A1AA] text-base sm:text-lg mb-10 max-w-sm leading-relaxed">
        AI-powered outfit ratings in seconds. Get your score, breakdown, and tips to level up.
      </p>

      {/* CTA */}
      <button
        onClick={onStart}
        className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-lg px-10 py-4 rounded-xl transition-all duration-200 animate-pulse-glow active:scale-[0.97]"
      >
        Upload Your Fit
      </button>

      {/* Scarcity */}
      <p className="text-[#A1A1AA] text-sm mt-6">
        {remaining > 0
          ? `${remaining} free check${remaining > 1 ? 's' : ''} today. No signup.`
          : "You've used your free checks today."
        }
      </p>

      {/* Example card */}
      <div className="mt-12 w-full max-w-xs">
        <div className="bg-[#141416] rounded-2xl p-6 border border-[#27272A]">
          <p className="text-[#A1A1AA] text-xs uppercase tracking-widest mb-4">Example Result</p>

          {/* Mini score ring */}
          <div className="flex justify-center mb-3">
            <svg width="100" height="100" viewBox="0 0 100 100" className="transform -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#27272A" strokeWidth="5" />
              <circle
                cx="50" cy="50" r="40"
                fill="none" stroke="#22C55E" strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - 8.2 / 10)}`}
              />
            </svg>
            <span className="absolute mt-7 font-display text-3xl font-extrabold text-[#22C55E]">8.2</span>
          </div>

          <div className="text-[#22C55E] font-bold text-base mb-3">Clean</div>
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="bg-[#8B5CF6]/15 text-[#8B5CF6] text-xs font-medium px-3 py-1 rounded-full">Clean Casual</span>
            <span className="bg-[#22C55E]/12 text-[#22C55E] text-xs font-medium px-3 py-1 rounded-full">Date Night ✓</span>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="mt-10 grid grid-cols-3 gap-4 w-full max-w-sm">
        {[
          { step: '1', label: 'Upload', desc: 'Drop your fit photo' },
          { step: '2', label: 'AI Rates', desc: 'Get scored in seconds' },
          { step: '3', label: 'Share', desc: 'Post your score card' },
        ].map(({ step, label, desc }) => (
          <div key={step} className="text-center">
            <div className="w-8 h-8 rounded-full bg-[#8B5CF6]/15 text-[#8B5CF6] text-sm font-bold flex items-center justify-center mx-auto mb-2">
              {step}
            </div>
            <p className="text-[#FAFAFA] text-sm font-semibold">{label}</p>
            <p className="text-[#A1A1AA] text-xs mt-0.5">{desc}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <p className="text-[#A1A1AA]/30 text-xs mt-auto pt-10">
        FitCheckAI &mdash; AI-powered outfit ratings
      </p>
    </div>
  )
}
