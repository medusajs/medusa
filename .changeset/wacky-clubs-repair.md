---
"@medusajs/ui": minor
---

feat(ui): add Chart component with Line, Bar, Area, and Pie variants

Introduces a new `Chart` compound component for data visualization, built on Recharts. All variants share a unified data-driven API (`data`, `index`, `categories`) with configurable legend, grid, tooltip, and axes, plus a `valueFormatter`. Bar and Area charts support stacking, Pie supports a donut mode, and colors resolve from the design system's tag color tokens so charts adapt to light and dark themes. Includes a shared tooltip, legend, unit tests, and Storybook stories.
