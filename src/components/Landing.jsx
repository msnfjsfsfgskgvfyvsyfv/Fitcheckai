import { useState, useEffect } from 'react'

export default function Landing({ onStart, remaining }) {
  const [show, setShow] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setShow(1), 100)   // brand
    const t2 = setTimeout(() => setShow(2), 300)   // subtext
    const t3 = setTimeout(() => setShow(3), 600)   // card
    const t4 = setTimeout(() => setShow(4), 900)   // CTA
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [])

  const ringCirc = 2 * Math.PI * 40
  const ringOffset = ringCirc * (1 - 8.2 / 10)

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      <div className="gradient-bg" />
      <div className="noise-grain" />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center relative z-10">
        {/* Brand — stagger 1 */}
        <div
          className="mb-8 transition-all duration-700"
          style={{
            opacity: show >= 1 ? 1 : 0,
            transform: show >= 1 ? 'translateY(0)' : 'translateY(16px)',
          }}
        >
          <h1 className="font-display text-5xl sm:text-6xl font-extrabold tracking-tight mb-3">
            <span className="text-[#F5F5F5]">FITCHECK</span>
            <span className="text-[#BFFF00]">AI</span>
          </h1>
        </div>

        {/* Subtext — stagger 2 */}
        <div
          className="mb-8 transition-all duration-700"
          style={{
            opacity: show >= 2 ? 1 : 0,
            transform: show >= 2 ? 'translateY(0)' : 'translateY(16px)',
          }}
        >
          <p className="text-xl sm:text-2xl font-semibold text-[#F5F5F5]/90 mb-3">
            Rate Your Fit.
          </p>
          <p className="text-[#737373] text-base sm:text-lg max-w-sm mx-auto leading-relaxed">
            AI-powered outfit ratings in seconds. Tell us what you're going for and get your score.
          </p>
        </div>

        {/* Example card — stagger 3, tilted */}
        <div
          className="w-full max-w-[280px] mb-10 transition-all duration-700"
          style={{
            opacity: show >= 3 ? 1 : 0,
            transform: show >= 3 ? 'translateY(0) rotate(-2deg)' : 'translateY(16px) rotate(-2deg)',
            animation: show >= 3 ? 'float 4s ease-in-out infinite' : 'none',
          }}
        >
          <div className="glass-card p-6">
            <p className="text-[#737373]/60 text-[10px] uppercase tracking-[0.2em] mb-5 font-medium">Example Result</p>

            {/* Mini score ring */}
            <div className="relative flex justify-center mb-4">
              <svg width="96" height="96" viewBox="0 0 100 100" className="transform -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                <circle
                  cx="50" cy="50" r="40"
                  fill="none" stroke="#BFFF00" strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={ringCirc}
                  strokeDashoffset={ringOffset}
                  style={{ filter: 'drop-shadow(0 0 6px rgba(191, 255, 0, 0.3))' }}
                />
              </svg>
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-2xl font-extrabold text-[#BFFF00]">8.2</span>
            </div>

            <div className="text-[#BFFF00] font-bold text-sm mb-3">Clean</div>

            {/* Mini bars */}
            <div className="space-y-2 mb-4">
              {[
                { label: 'Color', w: '80%' },
                { label: 'Fit', w: '70%' },
                { label: 'Style', w: '85%' },
              ].map(({ label, w }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="text-[#737373]/50 text-[10px] w-8 text-right">{label}</span>
                  <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: w, backgroundColor: '#BFFF00', opacity: 0.7 }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-1.5 justify-center">
              <span className="bg-[#BFFF00]/10 text-[#BFFF00] text-[10px] font-medium px-2.5 py-0.5 rounded-full">Clean Casual</span>
              <span className="bg-[#BFFF00]/8 text-[#BFFF00] text-[10px] font-medium px-2.5 py-0.5 rounded-full">Date Night &check;</span>
            </div>
          </div>
        </div>

        {/* CTA — stagger 4 */}
        <div
          className="w-full max-w-sm transition-all duration-700"
          style={{
            opacity: show >= 4 ? 1 : 0,
            transform: show >= 4 ? 'translateY(0)' : 'translateY(16px)',
          }}
        >
          <button
            onClick={onStart}
            className="w-full bg-[#BFFF00] hover:bg-[#8AB800] text-[#050505] font-bold text-lg rounded-2xl transition-all duration-300 animate-pulse-glow active:scale-[0.97]"
            style={{ height: '72px' }}
          >
            Upload Your Fit
          </button>

          <p className="text-[#737373]/70 text-sm mt-4">
            {remaining > 0
              ? `${remaining} free check${remaining > 1 ? 's' : ''} today — no signup needed`
              : "You've used your free checks today"
            }
          </p>
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
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#BFFF00] flex items-center justify-center mx-auto mb-2.5">
                {icon}
              </div>
              <p className="text-[#F5F5F5] text-sm font-medium">{label}</p>
              <p className="text-[#737373]/60 text-xs mt-0.5">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-6 relative z-10">
        <p className="text-[#737373]/20 text-xs">
          FitCheckAI
        </p>
      </div>
    </div>
  )
}
