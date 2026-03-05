import { useState } from 'react'
import Landing from './components/Landing'
import Upload from './components/Upload'
import Loading from './components/Loading'
import Results from './components/Results'
import Paywall from './components/Paywall'
import { analyzeOutfit } from './lib/api'
import { hasReachedLimit, incrementUsage, getRemainingChecks } from './lib/limits'
import imageCompression from 'browser-image-compression'

function App() {
  const [page, setPage] = useState('landing')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  async function handleUpload(file) {
    if (hasReachedLimit()) {
      setPage('paywall')
      return
    }

    setPage('loading')
    setError(null)

    try {
      // Compress image
      const compressed = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      })

      // Convert to base64
      const reader = new FileReader()
      const base64 = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(compressed)
      })

      const [header, data] = base64.split(',')
      const mimeType = header.match(/data:(.*?);/)?.[1] || 'image/jpeg'

      const analysis = await analyzeOutfit(data, mimeType)

      if (analysis.error) {
        setError(analysis.error_message)
        setPage('upload')
        return
      }

      incrementUsage()
      setResult(analysis)
      setPage('results')
    } catch (err) {
      console.error('Analysis failed:', err)
      setError('Something went wrong. Please try again.')
      setPage('upload')
    }
  }

  function handleReset() {
    if (hasReachedLimit()) {
      setPage('paywall')
    } else {
      setResult(null)
      setError(null)
      setPage('upload')
    }
  }

  return (
    <div className="min-h-dvh flex flex-col">
      {page === 'landing' && (
        <Landing
          onStart={() => {
            if (hasReachedLimit()) {
              setPage('paywall')
            } else {
              setPage('upload')
            }
          }}
          remaining={getRemainingChecks()}
        />
      )}
      {page === 'upload' && (
        <Upload onUpload={handleUpload} error={error} onBack={() => setPage('landing')} />
      )}
      {page === 'loading' && <Loading />}
      {page === 'results' && result && (
        <Results result={result} onReset={handleReset} />
      )}
      {page === 'paywall' && <Paywall />}
    </div>
  )
}

export default App
