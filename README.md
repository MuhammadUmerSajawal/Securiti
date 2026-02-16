# Analytics Dashboard Assignment

## Project Overview
This project is a single-page analytics dashboard built with React and Highcharts.
It follows the provided design direction and renders multiple chart cards with shared
page-level controls.

Implemented features:
- Dashboard layout with left navigation, page header, and chart grid
- 6 analytics cards with different chart types (`column`, `bar`, `line`, `area`)
- Page-level filters:
- Date range: Last 7 / 30 / 90 days
- Category: All / Security / Productivity / Infrastructure
- Page-level refresh and per-card refresh
- Simulated asynchronous data fetching with loading and error handling per chart

## Tech Stack
- React 19
- Vite 7
- Highcharts + highcharts-react-official
- lucide-react (icons)
- ESLint

## Setup Instructions
1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Run lint:
```bash
npm run lint
```

## Key Decisions and Trade-offs
- Data source is mocked in the frontend using asynchronous promises and simulated latency.
- Chart cards own their data request lifecycle (fetch/loading/error/retry) to keep each card isolated.
- Page-level controls trigger global refresh by incrementing a shared `refreshKey`.
- Inline styles were kept for speed of implementation and easy component-local tuning.

Trade-offs:
- No real backend integration or persistence.
- Data is randomized and regenerated on refresh/filter change.
- Styling is design-aligned but not pixel-perfect.

## What I Would Improve with More Time
- Replace mock data with a proper API layer and request caching
- Add tests for filter behavior and loading/error states
- Improve responsiveness for smaller breakpoints
- Add accessibility improvements (focus states, ARIA labels, keyboard flow)
- Move inline styles to a structured styling system for scalability

## Approximate Time Spent
~5 hours total:
- Layout and component structure: 1.5h
- Chart integration and card variants: 1.5h
- Data flow (filters + refresh): 1h
- Async loading/error handling + polish: 1h
