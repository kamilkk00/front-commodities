// app/brent/page.js
'use client'

import { useState } from 'react'

export default function BrentPage() {
  const [date, setDate]     = useState('2025-05-12')
  const [result, setResult] = useState(null)
  const [error, setError]   = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/brent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Brent Price Lookup</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
        <label>
          Select date:{' '}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ padding: 4, fontSize: '1em' }}
          />
        </label>
        <button type="submit" style={{ marginLeft: 8, padding: '4px 8px' }}>
          Get Price
        </button>
      </form>

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {result && (
        <pre
          style={{
            background: '#f0f0f0',
            padding: 12,
            borderRadius: 4,
          }}
        >
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </main>
  )
}