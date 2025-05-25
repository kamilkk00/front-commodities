// app/brent/page.js
'use client'

import { useState } from 'react'

export default function BrentPage() {
  const [date, setDate] = useState('2025-05-12')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
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
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Brent Price Lookup</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="date" className="text-sm font-medium text-gray-700 mb-2">Select Date</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Fetching...' : 'Get Price'}
          </button>
        </form>

        {error && <p className="mt-4 text-center text-red-500">Error: {error}</p>}

        {result && (
          <pre className="mt-6 bg-gray-50 p-4 rounded-lg overflow-auto text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>
    </main>
  )
}
