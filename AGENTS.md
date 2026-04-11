# Unificadora — Project Review Rules

## Purpose

This repository is the unified platform for multiple commercial landings.
Reviews must protect the architecture, preserve the Nebula visual selling advantage, and prevent domain hardcoding in the core.

## Architecture Rules

- Keep a strict separation between `src/core/*` and `src/brands/*`.
- `src/core/*` must remain domain-agnostic and reusable across brands/products.
- Brand, product, campaign, copy, and asset specifics belong in `src/brands/*`.
- Do not hardcode Nebula or VentaBici business rules inside the core.
- Use `LandingDefinition` as the central contract for landing composition.
- Prefer registry-driven composition over page-level hardcoded branching.

## Hero Rules

- The Nebula image-sequence hero is a critical business feature and must be preserved.
- Do not replace the sequence hero with a static image, generic carousel, or video-only shortcut without explicit approval.
- Hero behavior must stay configurable through typed data/contracts, not page-level hardcoding.
- Keep support for manifests, poster fallback, and graceful degradation for limited devices.

## Next.js / App Router Rules

- Default to Server Components unless interactivity requires a Client Component.
- Keep route files thin; move reusable logic to `src/core/*` or `src/brands/*`.
- Keep metadata and SEO derived from shared helpers/contracts, not scattered strings.
- Avoid unnecessary client-side state in route components.

## Quality Rules

- Favor clear, typed contracts over implicit object shapes.
- Keep changes small, composable, and easy to review.
- Do not introduce backend, database, Docker, or CI complexity unless explicitly requested.
- Do not build after changes unless explicitly requested.
- Preserve readability and maintainability over clever abstractions.

## Review Focus

When reviewing changes, pay special attention to:

- architectural separation (`core` vs `brands`)
- preservation of the Nebula hero capability
- SEO consistency
- type safety of landing/content contracts
- accidental coupling to a single product/domain
