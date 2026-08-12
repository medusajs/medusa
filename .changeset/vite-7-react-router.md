---
"@medusajs/dashboard": minor
---

feat(dashboard): upgrade to react-router 7

**Breaking:** projects must bump their own `react-router-dom` dependency to 7.x.

Left at v6, a project ends up with two router installations: its own v6 plus v7 for the dashboard. The dashboard is built against v7 while the admin bundler resolves `react-router-dom` from the project root, so plugin admin extensions get v6 hooks inside a v7 router and fail with _"useNavigate() may be used only in the context of a Router"_. Bumping the project's own dependency collapses this back to a single copy.

For admin extension authors: `json()` and `defer()` were removed in react-router 7 — return a `Response` and a plain object respectively. `UIMatch.data` is deprecated in favour of `UIMatch.loaderData`. `react-router-dom` remains a valid import specifier and is still externalized by `medusa plugin:build`, but it is removed in react-router 8, so plan to import from `react-router` instead.
