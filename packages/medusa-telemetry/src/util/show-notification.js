const defaultConfig = {
  padding: 1,
  borderColor: `blue`,
  borderStyle: `double`,
}

const defaultMessage =
  `Medusa collects anonymous usage analytics\n` +
  `to help improve Medusa for all users.\n` +
  `\n` +
  `If you'd like to opt-out, you can use \`medusa telemetry --disable\`\n`

/**
 * Analytics notice for the end-user
 */
async function showAnalyticsNotification(
  config = defaultConfig,
  message = defaultMessage
) {
  // boxen is ESM-only; loading it lazily keeps this package requirable from
  // Jest (which can't load ESM from node_modules), where we print it unboxed.
  try {
    const { default: boxen } = await import("boxen")
    console.log(boxen(message, config))
  } catch {
    console.log(message)
  }
}

export default showAnalyticsNotification
