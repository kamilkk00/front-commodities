# Commodity Price Checker

A Next.js app for checking historical commodity prices (Natural Gas, WTI, Brent) by date.

## Features

- Check Natural Gas, WTI, and Brent crude oil spot prices
- Interactive date picker (weekdays only, 2020-2025)
- Responsive design with Tailwind CSS
- Navigation between commodity types

## Tech Stack

- Next.js 14+ (App Router)
- React with custom components
- Tailwind CSS
- react-datepicker + date-fns

## Installation

```bash
npm install
npm install react-datepicker date-fns
npm run dev
```

Open `http://localhost:3000`

## Usage

1. Select a commodity from the header navigation
2. Pick a date (weekdays only)
3. Click "Get Price" to fetch spot price
4. View price in USD per MMBtu (Natural Gas) or per barrel (Oil)

## API Integration

Expects POST endpoints:
- `/api/natural-gas`
- `/api/wti` 
- `/api/brent`

Request format:
```json
{ "date": "2025-05-12" }
```

Response format:
```json
{ "price": 2.45 }
```
