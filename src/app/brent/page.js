// app/brent/page.js
'use client'

import { useState, forwardRef } from 'react'
import DatePicker from 'react-datepicker'
import { format, getYear, getMonth } from 'date-fns'
import enGB from 'date-fns/locale/en-GB'
import 'react-datepicker/dist/react-datepicker.css'

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const CustomInput = forwardRef(({ value, onClick }, ref) => (
  <button
    type="button"
    className="relative w-full text-left border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition"
    onClick={onClick}
    ref={ref}
  >
    <span className="block text-gray-700 font-medium">{value}</span>
    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
      <CalendarIcon />
    </div>
  </button>
))
CustomInput.displayName = 'CustomInput'

export default function BrentPage() {
  const minDate = new Date('2020-01-01')
  const maxDate = new Date('2025-05-19')

  const [selectedDate, setSelectedDate] = useState(new Date('2025-05-12'))
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const months = Array.from({ length: 12 }, (_, i) => format(new Date(2020, i, 1), 'MMMM', { locale: enGB }))
  const years = Array.from({ length: getYear(maxDate) - getYear(minDate) + 1 }, (_, i) => getYear(minDate) + i)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setResult(null)

    const dateStr = format(selectedDate, 'yyyy-MM-dd')

    setLoading(true)
    try {
      const res = await fetch('/api/brent', {
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
    <main className="min-h-screen bg-gray-50 flex items-start justify-center pt-16 px-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-extrabold text-center mb-6 text-blue-600">Brent Crude Oil Spot Price</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="date" className="text-sm font-semibold text-gray-800 mb-2">Select Date</label>
            <DatePicker
              id="date"
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              filterDate={(date) => date.getDay() !== 0 && date.getDay() !== 6}
              minDate={minDate}
              maxDate={maxDate}
              locale={enGB}
              dateFormat="dd-MM-yyyy"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              renderCustomHeader={({
                date,
                changeYear,
                changeMonth,
                decreaseMonth,
                increaseMonth,
                prevMonthButtonDisabled,
                nextMonthButtonDisabled,
              }) => (
                <div className="flex items-center justify-between px-3 py-2 bg-blue-50">
                  <button
                    onClick={decreaseMonth}
                    disabled={prevMonthButtonDisabled}
                    className="p-1 rounded hover:bg-blue-100 disabled:opacity-50"
                  >
                    ‹
                  </button>
                  <select
                    value={getMonth(date)}
                    onChange={(e) => changeMonth(Number(e.target.value))}
                    className="border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                  >
                    {months.map((month, idx) => (
                      <option key={month} value={idx}>{month}</option>
                    ))}
                  </select>
                  <select
                    value={getYear(date)}
                    onChange={(e) => changeYear(Number(e.target.value))}
                    className="border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <button
                    onClick={increaseMonth}
                    disabled={nextMonthButtonDisabled}
                    className="p-1 rounded hover:bg-blue-100 disabled:opacity-50"
                  >
                    ›
                  </button>
                </div>
              )}
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
              <span className="text-gray-600 text-sm mt-1">USD per barrel</span>
            </div>
          ) : (
            <div className="mt-6 bg-red-100 p-8 rounded-lg flex flex-col items-center">
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