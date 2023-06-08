const packages = [
  "react",
  "react-dom",
  "react-router-dom",
  "react-dnd",
  "react-dnd-html5-backend",
  "react-select",
  "react-helmet-async",
  "@tanstack/react-query",
  "@tanstack/react-table",
]

/**
 * Ensure that the admin-ui uses the same version of these packages as the project.
 */
export const webpackAliases = packages.reduce((acc, pkg) => {
  acc[`${pkg}$`] = require.resolve(pkg)
  return acc
}, {})
