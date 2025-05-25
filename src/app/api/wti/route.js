// app/api/brent/route.js
import { NextResponse } from 'next/server'

const UPSTREAM_URL = process.env.COMMODITIES_WTI

if (!UPSTREAM_URL) {
  throw new Error(
    'Missing environment variable COMMODITIES_WTI - please define it in .env'
  )
}

export async function POST(request) {
  const body = await request.json()
  // body = { date: "YYYY-MM-DD" }

  const resp = await fetch(UPSTREAM_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!resp.ok) {
    const text = await resp.text()
    return NextResponse.json(
      { error: `Upstream error: ${resp.status} ${text}` },
      { status: 502 }
    )
  }

  const data = await resp.json()
  return NextResponse.json(data)
}