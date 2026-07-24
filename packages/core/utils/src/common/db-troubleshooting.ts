/**
 * Base URL of the database troubleshooting guide in the Medusa documentation.
 */
export const DB_TROUBLESHOOTING_URL =
  "https://docs.medusajs.com/resources/troubleshooting/database-errors"

/**
 * Anchors to specific sections of the database troubleshooting guide.
 */
export const DBTroubleshootingSection = {
  MIGRATIONS: "error-while-running-migrations",
} as const

/**
 * Append a link to the database troubleshooting guide to an error message, so
 * connection failures point users to actionable next steps.
 *
 * @param message - The error message to append the link to.
 * @param section - An optional anchor to a specific section of the guide.
 */
export function withDbTroubleshootingLink(
  message: string,
  section?: string
): string {
  const url = section
    ? `${DB_TROUBLESHOOTING_URL}#${section}`
    : DB_TROUBLESHOOTING_URL

  return `${message}\n\nSee ${url} for troubleshooting steps.`
}
