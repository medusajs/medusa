/**
 * The bundle's file name and first line. `medusa start` only runs a file that
 * has both, so a project's own `server.ts` (compiled into the build output)
 * is never mistaken for a bundle.
 */
export const BUNDLE_FILE_NAME = "medusa-bundle.js"
export const BUNDLE_MARKER = "/* @medusajs/medusa bundle */"
export const MAIN_FILE_NAME = "medusa-bundle.main.js"

/**
 * Requires of external files resolved at build time are written as this
 * prefix plus the file's key; the entry maps them to where they're deployed.
 */
export const EXTERNAL_PREFIX = "medusa-key:"
