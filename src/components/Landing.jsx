export default function Landing({ onStart, remaining }) {
  const ringCirc = 2 * Math.PI * 40
  const ringOffset = ringCirc * (1 - 8.2 / 10)

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      {/* Gradient mesh */}
      <div className="gradient-mesh" />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center relative z-10">
        {/* Brand */}
        <div className="mb-8">
          <h1 className="font-display text-5xl sm:text-6xl font-extrabold tracking-tight mb-3">
            <span className="text-[#FAFAFA]">FITCHECK</span>
            <span className="bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] bg-clip-text text-transparent">AI</span>
          </h1>
          <p className="text-xl sm:text-2xl font-semibold text-[#FAFAFA]/90 mb-3">
            Rate Your Fit.
          </p>
          <p className="text-[#A1A1AA] text-base sm:text-lg max-w-sm mx-auto leading-relaxed">
            AI-powered outfit ratings in seconds. Get your score, breakdown, and tips to level up.
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={onStart}
          className="group relative bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-lg px-12 py-4 rounded-2xl transition-all duration-300 animate-pulse-glow active:scale-[0.97] mb-4"
        >
          <span className="relative z-10">Upload Your Fit</span>
        </button>

        <p className="text-[#A1A1AA]/70 text-sm mb-12">
          {remaining > 0
            ? `${remaining} free check${remaining > 1 ? 's' : ''} today — no signup needed`
            : "You've used your free checks today"
          }
        </p>

        {/* Example card */}
        <div className="w-full max-w-[280px] animate-float">
          <div className="glass-card p-6">
            <p className="text-[#A1A1AA]/60 text-[10px] uppercase tracking-[0.2em] mb-5 font-medium">Example Result</p>

            {/* Mini score ring */}
            <div className="relative flex justify-center mb-4">
              <svg width="96" height="96" viewBox="0 0 100 100" className="transform -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                <circle
                  cx="50" cy="50" r="40"
                  fill="none" stroke="#22C55E" strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={ringCirc}
                  strokeDashoffset={ringOffset}
                  style={{ filter: 'drop-shadow(0 0 6px rgba(34, 197, 94, 0.3))' }}
                />
              </svg>
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-2xl font-extrabold text-[#22C55E]">8.2</span>
            </div>

            <div className="text-[#22C55E] font-bold text-sm mb-3">Clean</div>

            {/* Mini bars */}
            <div className="space-y-2 mb-4">
              {[
                { label: 'Color', w: '80%', color: '#22C55E' },
                { label: 'Fit', w: '70%', color: '#22C55E' },
                { label: 'Style', w: '85%', color: '#22C55E' },
              ].map(({ label, w, color }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="text-[#A1A1AA]/50 text-[10px] w-8 text-right">{label}</span>
                  <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: w, backgroundColor: color, opacity: 0.7 }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-1.5 justify-center">
              <span className="bg-[#8B5CF6]/10 text-[#8B5CF6] text-[10px] font-medium px-2.5 py-0.5 rounded-full">Clean Casual</span>
              <span className="bg-[#22C55E]/8 text-[#22C55E] text-[10px] font-medium px-2.5 py-0.5 rounded-full">Date Night ✓</span>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-14 grid grid-cols-3 gap-6 w-full max-w-sm">
          {[
            { icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
              </svg>
            ), label: 'Upload', desc: 'Drop your fit' },
            { icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
              </svg>
            ), label: 'AI Rates', desc: 'Scored in seconds' },
            { icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
              </svg>
            ), label: 'Share', desc: 'Post your card' },
          ].map(({ icon, label, desc }) => (
            <div key={label} className="text-center">
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#8B5CF6] flex items-center justify-center mx-auto mb-2.5">
                {icon}
              </div>
              <p className="text-[#FAFAFA] text-sm font-medium">{label}</p>
              <p className="text-[#A1A1AA]/60 text-xs mt-0.5">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-6 relative z-10">
        <p className="text-[#A1A1AA]/20 text-xs">
          FitCheckAI
        </p>
      </div>
    </div>
  )
}
