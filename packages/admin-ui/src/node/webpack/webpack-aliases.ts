import { ALIASED_PACKAGES } from "../constants"

/**
 * Ensure that the admin-ui uses the same version of these packages as the project.
 */
export const webpackAliases = ALIASED_PACKAGES.reduce((acc, pkg) => {
  acc[`${pkg}$`] = require.resolve(pkg)
  return acc
}, {})
