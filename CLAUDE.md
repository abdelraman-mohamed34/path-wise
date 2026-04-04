# Project: Maps & Locations App

## Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (TSX)
- **Styling**: Tailwind CSS (Utility-first)
- **State Management**: Redux Toolkit (AppDispatch/RootState)
- **Animations**: Framer Motion
- **Maps**: React Map GL (Maplibre)

## Coding Standards
- Use **Functional Components** with `memo` for UI performance.
- Preference for **Lucide React** for icons.
- Use `shadcn/ui` patterns or custom glassmorphism components.
- Always use **Lucide icons** for map-related actions.
- Use `use client` directive only when necessary (interactive components).

## Naming Conventions
- Components: PascalCase (e.g., `MapComponent.tsx`)
- Hooks: camelCase (e.g., `useFavorites.ts`)
- Redux Slices: camelCase (e.g., `detailsSlice.ts`)

## Common Commands
- Build: `npm run build`
- Dev: `npm run dev`
- Lint: `npm run lint`

## Specific Rules
- Coordinate precision: Use `Math.abs(diff) > 0.0001` for map comparisons.
- Storage: Use `localStorage` for `favorites` and `recent_searches` (max 8 items).
- UI: Maintain a "Glassmorphism" theme using `bg-window/80` and `backdrop-blur`.