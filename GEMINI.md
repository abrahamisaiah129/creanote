# Creanote UI & Iconography Rules

When generating, editing, or suggesting UI components (especially eyebrow pills, badges, and buttons), you must strictly adhere to the following constraints to protect the brand's minimalist, creative aesthetic:

- **ZERO EMOJIS**: Never use standard Unicode emojis (e.g., 🚀, ✨, 🔥, 🔒) anywhere in the UI.
- **NO DECORATIVE FLUFF**: Do not add generic icons just to fill space or "make it look nice." Every element must serve a purpose.
- **FUNCTIONAL SVGS ONLY**: If an icon is required for context (e.g., a shield for Legal/Trust, an envelope for Contact), use only crisp, minimalist, monochrome SVGs that match the site's geometric aesthetic.
- **DEFAULT TO TEXT**: Unless an icon provides immediate, critical semantic meaning, default to text-only components. Let the typography and spacing do the heavy lifting.

# Creanote Responsive Design & Layout Rules

When writing or updating CSS, Tailwind classes, or layout components, you must strictly follow these responsive design principles to prevent overflow, text truncation, and horizontal scrolling:

- **MOBILE-FIRST ALWAYS**: Default all layout classes (flex, grid, padding) to the mobile view. Use responsive breakpoints (e.g., md:, lg:) only to scale up for tablets and desktops. Never write desktop styles as the default.
- **STACK BEFORE SQUISH**: Do not force elements into a horizontal row (flex-row) on mobile if they contain dense information (like a date, text block, and image). Default to flex-col on mobile, and switch to md:flex-row only when there is enough screen real estate.
- **FLUID MEDIA CONTAINERS**: Images and thumbnails must never break their containers. Always apply w-full, max-w-full, object-cover, and define a specific aspect ratio or height constraint. Never let an image dictate the width of a flex container to the point where it crushes adjacent text.
- **SAFE TEXT TRUNCATION**: If text must be constrained in a row, use min-w-0 on the text container to allow flex-shrink to work properly. Use intentional truncation (e.g., line-clamp-2 or truncate) rather than letting text arbitrarily clip or overflow its boundaries.
- **SPACING, PADDING & TOUCH TARGETS**: Ensure generous touch targets (minimum 44px height for inputs and buttons). Use consistent padding (e.g., p-4 on mobile, p-8 on desktop) on the outer containers to prevent content from touching the screen edges.
- **FLUID FORM LAYOUT**: Form inputs must stack vertically on mobile (100% width) and sit side-by-side (using grid or flex) on tablet and desktop screens. Do not delete any existing functionality or state when refactoring layouts.
- **MOBILE DATA TABLE HANDLING**: Never let tables overflow the page uncontrollably. Either wrap the table in a container with `overflow-x-auto` so only the table scrolls horizontally, or convert the table rows into stacked "cards" on mobile view and revert to a standard `<table>` on desktop view.
- **STRICT CSS SIZING**: Avoid hacky negative margins or hardcoded pixel widths (e.g., `w-[400px]`). Strictly use percentages, flexbox, or grid fractions (`w-full`, `flex-1`, `grid-cols-1 md:grid-cols-2`).

# Creanote Copywriting & Content Rules

When generating site data, mock content, highlight cards, or any product copy, you must act as a consumer-friendly product copywriter and strictly adhere to the following constraints:

- **ZERO TECHNICAL JARGON**: Absolutely no software development, coding, or backend terminology.
- **BANNED CONCEPTS**: Do not mention databases (e.g., MongoDB, SQL), styling variables/code (e.g., `var(--orange)`, hex codes), infrastructure (e.g., latency, edge timelines, concurrency), or developer frameworks (e.g., Tailwind, Subgrid, zero-runtime).
- **TONE & FOCUS**: Emphasize the end-user experience and the creative journey. Use plain-English color names (e.g., just "Orange"), straightforward categorizations, and keep the language natural and engaging for non-technical visitors.
- **OUTPUT STYLE**: Product and card names should be catchy and benefit-driven. Badges and options should use simple, clean metadata (e.g., "Design," "Startup," "Craft"). Basic site info should be a plain-English summary of what the feature offers the user.

# Creanote E2E Testing Rules

When writing or updating End-to-End (E2E) tests, you must act as a Lead SDET and strictly adhere to the following constraints:

- **COVERAGE SCOPE**: Tests must cover full Create, Read, Update, and Delete lifecycles, image uploads/rejections, real-time text updates, and access controls/restrictions.
- **NO SPAGHETTI CODE**: Control flow must be linear and highly readable. Use modular design (Page Object Model or custom commands) to separate test logic from UI selectors.
- **NO ANTI-PATTERNS**: Never use hardcoded pauses or fixed sleeps. Always use dynamic waits/assertions for elements to become visible or network requests to complete. Do not create tests that depend on the execution order of other tests.
- **NO BLOATED CODE**: Use `beforeEach` hooks, fixtures, and shared utility functions appropriately to keep the codebase lean. Avoid massive, repetitive setup blocks.
- **ZERO TECHNICAL DEBT**: Use semantic, resilient selectors (e.g., `data-testid`) rather than brittle CSS paths. Prioritize long-term maintainability and clear documentation over quick hacks.
