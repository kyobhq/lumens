# Agent Guidelines

## Commands

```bash
pnpm dev          # Start all apps (turbo)
pnpm build        # Build all apps
pnpm lint         # Lint all apps
pnpm test         # Run all tests
# Single test: cd apps/api && node ace test tests/path/to/file.spec.ts
```

## Project Structure

- `apps/api` — AdonisJS 6 backend (Lucid ORM, VineJS validation, Tuyau for type-safe API)
- `apps/web` — SvelteKit 2 frontend (Svelte 5 runes, Tailwind v4, bits-ui)
- `packages/` — Shared ESLint/TS configs

## Code Style

- **Formatting**: Prettier (no semi, single quotes, 120 printWidth, trailing comma es5)
- **Imports**: Sorted by line length (prettier-plugin-sort-imports)
- **TypeScript**: Strict mode, no `any`, no unused vars/params
- **API**: AdonisJS 6 - use `#modules/*` imports, controllers get `@inject()`, services handle logic
- **Web**: SvelteKit 2 + Svelte 5 runes + Tailwind v4, use `$lib/` alias, `*.svelte.ts` for stores
- **Naming**: camelCase (vars/functions/hooks), kebab-case (front-end files), snake_case (backend files)
- **Errors**: Use typed exceptions (AdonisJS), never empty catch blocks

## Patterns

- Validators: Define in `validators.ts`, export validator + `Infer` type
- Services: Business logic, inject `HttpContext` via constructor
- Controllers: Thin, delegate to services, return transformer output
- Actions: Pure functions for one-time operations (e.g., `optimize_image.ts`, `get_artifact_type.ts`). Place in `actions/` directory within the module.
- Stores (web): Class with `$state` fields, context-based init/get functions
