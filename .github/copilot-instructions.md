# Copilot Instructions for sgk-commanders-web

**Purpose:** Short, actionable guidance to help an AI coding agent become productive quickly in this repo.

## Big picture

- Framework: **Next.js (App Router)** — main UI lives in `app/` (server components by default). Entry points: `app/layout.tsx`, `app/page.tsx`.
- Styling: **Tailwind CSS** with project-wide CSS variables in `app/globals.css` (dark theme toggles via `.dark` class). Use `@apply` and the provided CSS variables rather than hard-coding colors.
- UI primitives: built with **shadcn patterns** and CVA (`class-variance-authority`) — see `components.json` and `components/ui/*`.
- Utilities: `lib/utils.ts` exports `cn(...)` (clsx + tailwind-merge) — use it for composing classNames safely.
- Assets: store static files in `public/` and prefer `next/image` for images (see `app/page.tsx`).

## Important files & conventions

- `app/layout.tsx` — app-level layout and fonts (`next/font/google` used for Geist fonts).
- `app/globals.css` — theme tokens, Tailwind layers, and custom variants (e.g., `@custom-variant dark`).
- `components/json` — shadcn config; `components/ui/*` contains shared components (e.g., `button.tsx`).
- `components/ui/button.tsx` — canonical CVA-based component. Pattern to follow:
  - export `buttonVariants` (via `cva`) and the `Button` component
  - use `cn(buttonVariants({ variant, size, className }))` for classes
- `lib/utils.ts` — `cn` helper; prefer this instead of manual class merges.
- `tsconfig.json` — path alias `@/*` maps to repo root; prefer imports like `@/components` or `@/lib`.
- `eslint.config.mjs` — uses Next.js recommended rules; run `npm run lint` to check linting.

## Scripts / workflows

- Dev: `npm run dev` (server starts at http://localhost:3000)
- Build: `npm run build` then `npm run start` to serve the production build
- Lint: `npm run lint` (auto-fix: `npm run lint -- --fix`)

## Patterns to preserve (do NOT change unless necessary)

- Keep server/client distinction in App Router: add `"use client"` only when component needs browser APIs or state.
- Use CVA for multi-variant components and export both variants and the component (see `components/ui/button.tsx`).
- Use the `cn` helper to combine classes and `tailwind-merge`-aware merging to avoid conflicting utilities.
- Use CSS variables defined in `app/globals.css` for theme-aware colors and spacing.

## External integrations & dependencies

- Notable packages: `next@^15`, `react@19`, `tailwindcss@4`, `class-variance-authority`, `radix-ui`, `lucide-react`, `tw-animate-css`.
- Deployment target: Vercel is the expected host (README references Vercel templates).

## Quick examples (copyable)

- Import component: `import { Button } from "@/components/ui/button"`
- Use `cn`: `const classes = cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'my-extra-class')`
- Add client behavior: top of file add `"use client"` when using hooks or browser-only APIs.

## Notes / what I couldn't find

- No CI/automation config was detected (no GitHub Actions or other CI files). Add instructions if CI exists elsewhere.
- No tests detected — if unit or e2e tests are added, reference their runner and scripts here.

---

If you'd like, I can expand any section (examples, component conventions, or add CI/PR guidance). What should I clarify or add next? ✅
