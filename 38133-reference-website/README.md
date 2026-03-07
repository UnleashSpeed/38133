# 3GPP TS 38.133 Reference Website

A comprehensive, interactive reference for 3GPP TS 38.133 Clauses 7, 8, and 9 - NR Requirements for support of radio resource management.

## Features

- **Three-Layer Content View**: Switch between Expert Overview, Detailed Analysis, and Verbatim Specification text
- **Semantic Search**: Full-text search across all clauses with relevance scoring
- **Interactive Tables**: Filter, sort, search, and export tabular data
- **Formula Rendering**: Beautifully rendered mathematical formulas using KaTeX
- **Cross-Reference Engine**: Link related requirements across clauses
- **Dark/Light Mode**: Full theme support

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Math Rendering**: KaTeX
- **Animations**: Framer Motion
- **Search**: Fuse.js

## Project Structure

```
38133-reference-website/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with sidebar and theme
│   ├── page.tsx           # Home page
│   ├── clause7/page.tsx   # Clause 7: Timing
│   ├── clause8/page.tsx   # Clause 8: Signalling
│   ├── clause9/page.tsx   # Clause 9: Measurement
│   └── about/page.tsx     # About page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── Sidebar.tsx       # Navigation sidebar
│   ├── FormulaRenderer.tsx # KaTeX formula rendering
│   ├── InteractiveTable.tsx # Data table with filtering
│   ├── CrossReference.tsx   # Cross-reference links
│   ├── SemanticSearch.tsx   # Search functionality
│   ├── ContentLayerToggle.tsx # Layer view toggle
│   └── Breadcrumb.tsx    # Breadcrumb navigation
├── lib/                  # Utility functions
│   ├── utils.ts         # General utilities
│   └── data.ts          # Data loading functions
├── types/               # TypeScript types
│   └── index.ts         # Type definitions
├── public/data/         # JSON data files
│   ├── clause7_parsed.json
│   ├── clause8_parsed.json
│   ├── clause9_parsed.json
│   └── *_explanations.json
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Development

The development server will start at `http://localhost:3000`

## Data Sources

The website uses parsed data from:
- `clause7_parsed.json` - Timing requirements
- `clause8_parsed.json` - Signalling characteristics
- `clause9_parsed.json` - Measurement procedures
- `clause*_explanations.json` - Expert explanations

## Design System

### Colors
- **Primary**: Nokia Blue `#005AFF`
- **Secondary**: Deep Navy `#124191`
- **Background**: Clean white / Dark mode support
- **Accents**: Premium grays

### Typography
- **Font**: Inter (matching Nokia Pure metrics)
- **Mono**: JetBrains Mono for code/formulas

## License

This project is for informational purposes only. Official 3GPP specifications should be consulted for definitive requirements.

## Disclaimer

This website is not affiliated with 3GPP or its member organizations.
