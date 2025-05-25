// app/natural-gas/page.js
'use client'

import { useState, forwardRef } from 'react'
import DatePicker from 'react-datepicker'
import { format } from 'date-fns'
import enGB from 'date-fns/locale/en-GB'
import 'react-datepicker/dist/react-datepicker.css'

// Inline SVG calendar icon component
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

// Custom input to include calendar icon
const CustomInput = forwardRef(({ value, onClick }, ref) => (
  <button
    type="button"
    className="relative w-full text-left border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    onClick={onClick}
    ref={ref}
  >
    <span className="block">{value}</span>
    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
      <CalendarIcon />
    </div>
  </button>
))
CustomInput.displayName = 'CustomInput'

export default function NaturalGasPage() {
  // Restrict selectable range: Jan 1, 2020 – May 19, 2025
  const minDate = new Date('2020-01-01')
  const maxDate = new Date('2025-05-19')

  const [selectedDate, setSelectedDate] = useState(new Date('2025-05-12'))
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setResult(null)

    const dateStr = format(selectedDate, 'yyyy-MM-dd')

    setLoading(true)
    try {
      const res = await fetch('/api/natural-gas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: dateStr }),
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
    <main className="min-h-screen bg-gray-100 flex items-start justify-center pt-16 px-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Natural Gas Price Lookup</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="date" className="text-sm font-medium text-gray-700 mb-2">Select Date</label>
            <DatePicker
              id="date"
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              filterDate={(date) => date.getDay() !== 0 && date.getDay() !== 6}
              minDate={minDate}
              maxDate={maxDate}
              locale={enGB}
              dateFormat="dd-MM-yyyy"
              customInput={<CustomInput />}
            />
            <small className="text-xs text-gray-500 mt-1">
              Only weekdays from 01-01-2020 to 19-05-2025 are selectable
            </small>
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
          Number(result.price) === result.price ? (
            <div className="mt-6 bg-green-50 p-6 rounded-lg flex flex-col items-center">
              <span className="text-gray-600 text-sm">Price on {format(selectedDate, 'dd-MM-yyyy')}</span>
              <span className="text-4xl font-semibold mt-2">${result.price.toFixed(2)}</span>
              <span className="text-gray-600 text-sm mt-1">USD per MMBtu</span>
            </div>
          ) : (
            <div className="mt-6 bg-red-100 p-8 rounded-lg flex flex-col items-center">
              {/* Split message to have date on new line */}
              {(() => {
                const [prefix, datePart] = result.price.split(/(?='\d{4}-\d{2}-\d{2}')/)
                return (
                  <span className="text-red-700 text-2xl font-semibold text-center">
                    {prefix}
                    <br />
                    {datePart}
                  </span>
                )
              })()}
            </div>
          )
        )}
      </div>
    </main>
  )
}