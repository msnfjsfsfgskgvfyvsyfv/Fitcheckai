import { useState, useRef } from 'react'

export default function Upload({ onUpload, error, onBack }) {
  const [preview, setPreview] = useState(null)
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  function handleFile(f) {
    if (!f) return
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic']
    if (!validTypes.includes(f.type) && !f.name.match(/\.(jpg|jpeg|png|webp|heic)$/i)) {
      return
    }
    if (f.size > 10 * 1024 * 1024) {
      return
    }
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
      <button onClick={onBack} className="self-start text-[#A1A1AA] text-sm mb-6 hover:text-white transition">
        ← Back
      </button>

      <h2 className="text-2xl font-bold mb-2">Upload Your Fit</h2>
      <p className="text-[#A1A1AA] text-sm mb-8">JPG, PNG, WebP, or HEIC — max 10MB</p>

      {/* Error */}
      {error && (
        <div className="w-full max-w-sm bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-xl px-4 py-3 mb-6 text-[#EF4444] text-sm text-center">
          {error}
        </div>
      )}

      {/* Upload area */}
      {!preview ? (
        <div
          className={`w-full max-w-sm aspect-[3/4] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
            dragging
              ? 'border-[#8B5CF6] bg-[#8B5CF6]/10'
              : 'border-[#2A2A2A] bg-[#1A1A1A] hover:border-[#8B5CF6]/50'
          }`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <div className="text-5xl mb-4">📸</div>
          <p className="text-white font-semibold mb-1">Tap to upload</p>
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
          <div className="relative rounded-2xl overflow-hidden border border-[#2A2A2A] mb-6">
            <img
              src={preview}
              alt="Outfit preview"
              className="w-full aspect-[3/4] object-cover"
            />
            <button
              onClick={() => { setPreview(null); setFile(null) }}
              className="absolute top-3 right-3 bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-black/80"
            >
              ✕
            </button>
          </div>

          <button
            onClick={() => file && onUpload(file)}
            className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-lg py-4 rounded-2xl transition-all active:scale-[0.98]"
          >
            Rate My Fit
          </button>
        </div>
      )}
    </div>
  )
}
