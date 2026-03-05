import { useState, useRef } from 'react'
import { getRemainingChecks } from '../lib/limits'

const OCCASIONS = [
  'School', 'Date night', 'Work', 'Party / going out',
  'Hanging with friends', 'Wedding / formal', 'Just because',
]

const VIBES = [
  'Casual', 'Dressy', 'Streetwear', 'Clean / minimal',
  'Bold / standout', 'Cozy', 'Professional', "I don't know",
]

function PillSelect({ label, options, selected, onSelect, allowCustom }) {
  const [custom, setCustom] = useState('')
  const isCustomActive = selected && !options.includes(selected)

  return (
    <div className="w-full max-w-sm">
      <p className="text-[#FAFAFA]/80 text-sm font-medium mb-2.5">{label} <span className="text-[#A1A1AA]/40 font-normal">optional</span></p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onSelect(selected === opt ? null : opt)}
            className={`text-sm px-3.5 py-1.5 rounded-full border transition-all duration-200 active:scale-[0.96] ${
              selected === opt
                ? 'bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] border-transparent text-white font-medium shadow-md shadow-[#8B5CF6]/15'
                : 'bg-white/[0.03] border-white/[0.08] text-[#A1A1AA]/80 hover:border-[#8B5CF6]/30 hover:text-[#FAFAFA]/90'
            }`}
          >
            {opt}
          </button>
        ))}
        {allowCustom && (
          <div className="relative">
            <input
              type="text"
              placeholder="Other..."
              value={isCustomActive ? selected : custom}
              onChange={(e) => {
                setCustom(e.target.value)
                if (e.target.value) onSelect(e.target.value)
                else onSelect(null)
              }}
              className={`text-sm px-3.5 py-1.5 rounded-full border bg-white/[0.03] w-24 transition-all duration-200 placeholder-[#A1A1AA]/30 focus:outline-none focus:w-36 ${
                isCustomActive
                  ? 'border-[#8B5CF6]/50 text-[#FAFAFA] bg-[#8B5CF6]/10'
                  : 'border-white/[0.08] text-[#A1A1AA]/80'
              }`}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default function Upload({ onUpload, error, onBack }) {
  const [preview, setPreview] = useState(null)
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [occasion, setOccasion] = useState(null)
  const [vibe, setVibe] = useState(null)
  const inputRef = useRef(null)
  const remaining = getRemainingChecks()

  function handleFile(f) {
    if (!f) return
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic']
    if (!validTypes.includes(f.type) && !f.name.match(/\.(jpg|jpeg|png|webp|heic)$/i)) return
    if (f.size > 10 * 1024 * 1024) return
    setFile(f)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(f)
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      <div className="gradient-mesh" />

      <div className="flex-1 flex flex-col items-center px-6 py-8 relative z-10 overflow-y-auto">
        {/* Back */}
        <button onClick={onBack} className="self-start text-[#A1A1AA]/60 text-sm mb-6 hover:text-[#FAFAFA] transition-colors duration-300 flex items-center gap-1.5 flex-shrink-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Back
        </button>

        <h2 className="font-display text-3xl font-bold mb-2 flex-shrink-0">Upload Your Fit</h2>
        <p className="text-[#A1A1AA]/70 text-sm mb-6 flex-shrink-0">JPG, PNG, WebP, or HEIC &mdash; max 10MB</p>

        {/* Error */}
        {error && (
          <div className="w-full max-w-sm glass-card !border-[#EF4444]/20 px-4 py-3 mb-6 text-[#EF4444] text-sm text-center flex-shrink-0">
            {error}
          </div>
        )}

        {/* Upload area */}
        {!preview ? (
          <div
            className={`w-full max-w-sm aspect-[3/4] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 flex-shrink-0 ${
              dragging
                ? 'border-[#8B5CF6] bg-[#8B5CF6]/5 scale-[1.01]'
                : 'border-white/[0.08] bg-white/[0.02] hover:border-[#8B5CF6]/30 hover:bg-white/[0.03]'
            }`}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 ${
              dragging ? 'bg-[#8B5CF6]/15 text-[#8B5CF6]' : 'bg-white/[0.04] text-[#A1A1AA]/60'
            }`}>
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
              </svg>
            </div>
            <p className="text-[#FAFAFA] font-semibold mb-1">Tap to upload</p>
            <p className="text-[#A1A1AA]/50 text-sm">or drag & drop your photo</p>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic,.jpg,.jpeg,.png,.webp,.heic"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </div>
        ) : (
          <div className="w-full max-w-sm animate-fade-in space-y-5 flex-shrink-0">
            {/* Photo preview */}
            <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl shadow-black/40">
              <img
                src={preview}
                alt="Outfit preview"
                className="w-full aspect-[3/4] object-cover"
              />
              <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 to-transparent" />
              <button
                onClick={() => { setPreview(null); setFile(null); setOccasion(null); setVibe(null) }}
                className="absolute top-3 right-3 bg-black/40 backdrop-blur-md text-white/80 rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/60 hover:text-white transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Context inputs */}
            <div className="space-y-4">
              <PillSelect
                label="Where are you going?"
                options={OCCASIONS}
                selected={occasion}
                onSelect={setOccasion}
                allowCustom
              />
              <PillSelect
                label="What's the vibe?"
                options={VIBES}
                selected={vibe}
                onSelect={setVibe}
              />
            </div>

            {/* Rate button */}
            <button
              onClick={() => file && onUpload(file, preview, { occasion, vibe })}
              className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-lg py-4 rounded-2xl transition-all duration-300 active:scale-[0.97] shadow-lg shadow-[#8B5CF6]/20"
            >
              Rate My Fit &rarr;
            </button>
          </div>
        )}

        {/* Bottom info */}
        <div className="mt-auto pt-8 text-center space-y-1.5 flex-shrink-0">
          <div className="flex items-center justify-center gap-1.5 text-[#A1A1AA]/40 text-xs">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
            Photos are never stored
          </div>
          <p className="text-[#A1A1AA]/30 text-xs">
            {remaining} check{remaining !== 1 ? 's' : ''} remaining today
          </p>
        </div>
      </div>
    </div>
  )
}
