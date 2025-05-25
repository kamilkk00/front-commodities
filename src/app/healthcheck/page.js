// src/app/healthcheck/page.js
'use client'

import { useEffect, useState } from 'react'

export default function HealthCheckPage() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/healthcheck')
      .then(async (res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`)
        return res.json()
      })
      .then(setData)
      .catch((err) => setError(err.message))
  }, [])

  if (error) return <pre>Error: {error}</pre>
  if (!data) return <p>Loading…</p>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Healthcheck</h1>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}