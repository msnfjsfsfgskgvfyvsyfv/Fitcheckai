import { useState, useRef } from 'react'
import { getRemainingChecks } from '../lib/limits'

export default function Upload({ onUpload, error, onBack }) {
  const [preview, setPreview] = useState(null)
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)
  const remaining = getRemainingChecks()

  function handleFile(f) {
    if (!f) return
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic']
    if (!validTypes.includes(f.type) && !f.name.match(/\.(jpg|jpeg|png|webp|heic)$/i)) {
      return
    }
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
    <div className="flex-1 flex flex-col items-center px-6 py-8">
      {/* Back */}
      <button onClick={onBack} className="self-start text-[#A1A1AA] text-sm mb-6 hover:text-[#FAFAFA] transition-colors duration-200">
        &larr; Back
      </button>

      <h2 className="font-display text-2xl font-bold mb-2">Upload Your Fit</h2>
      <p className="text-[#A1A1AA] text-sm mb-6">JPG, PNG, WebP, or HEIC &mdash; max 10MB</p>

      {/* Error */}
      {error && (
        <div className="w-full max-w-sm bg-[#EF4444]/10 border border-[#EF4444]/25 rounded-xl px-4 py-3 mb-6 text-[#EF4444] text-sm text-center">
          {error}
        </div>
      )}

      {/* Upload area */}
      {!preview ? (
        <div
          className={`w-full max-w-sm aspect-[3/4] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
            dragging
              ? 'border-[#8B5CF6] bg-[#8B5CF6]/8'
              : 'border-[#27272A] bg-[#141416] hover:border-[#8B5CF6]/40'
          }`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          {/* Camera icon */}
          <svg className="w-12 h-12 text-[#A1A1AA] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
          </svg>
          <p className="text-[#FAFAFA] font-semibold mb-1">Tap to upload</p>
          <p className="text-[#A1A1AA] text-sm">or drag & drop</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,.jpg,.jpeg,.png,.webp,.heic"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </div>
      ) : (
        <div className="w-full max-w-sm">
          <div className="relative rounded-2xl overflow-hidden border border-[#27272A] mb-5">
            <img
              src={preview}
              alt="Outfit preview"
              className="w-full aspect-[3/4] object-cover"
            />
            <button
              onClick={() => { setPreview(null); setFile(null) }}
              className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-black/80 transition-colors"
            >
              ✕
            </button>
          </div>

          <button
            onClick={() => file && onUpload(file, preview)}
            className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-lg py-4 rounded-xl transition-all duration-200 active:scale-[0.97]"
          >
            Rate My Fit &rarr;
          </button>
        </div>
      )}

      {/* Privacy + remaining */}
      <div className="mt-auto pt-8 text-center">
        <p className="text-[#A1A1AA]/60 text-xs mb-1">
          Photos are never stored
        </p>
        <p className="text-[#A1A1AA]/40 text-xs">
          {remaining} check{remaining !== 1 ? 's' : ''} remaining today
        </p>
      </div>
    </div>
  )
}
