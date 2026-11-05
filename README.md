# SalesPulse - Sales Analytics Dashboard

A responsive, single-page executive sales analytics dashboard built with vanilla HTML5, CSS3, and JavaScript.

## Features

- **Executive KPI Cards**: Real-time tracking of Gross Revenue, Estimated Net Profit, Closed Deals, Average Order Value (AOV), Deal Fulfillment Rate, and Top Performing Category.
- **Interactive Visualizations**:
  - Revenue & Velocity timeline (Line / Area chart with metric toggles)
  - Category breakdown distribution (Doughnut chart)
  - Regional market performance (Bar chart)
  - Sales representative leaderboard with quota achievement bars
  - Built-in HTML5 Canvas fallback for completely offline environments
- **Full Data Management**:
  - Persistent storage using WebStorage (`localStorage`)
  - Log new sales and edit existing transactions via an interactive modal
  - Multi-criteria filtering (time window, category, status, region) and live full-text search
  - Multi-column sorting and paginated records
  - Instant CSV export of filtered records
  - Restore sample dataset anytime
- **Pure Vanilla Codebase**:
  - Zero external frameworks
  - Zero CSS variables (styled with direct, high-contrast values)
  - Zero backend requirements

## Getting Started

Simply open `index.html` in any modern web browser.
