/**
 * Startup profiling: with `MEDUSA_LOG_BOOT_TIMINGS=true`, logs how long each
 * startup phase takes (and when it ended, in seconds since the process
 * started), to see where a slow boot spends its time.
 */
export async function timeBoot<T>(
  label: string,
  run: () => Promise<T> | T
): Promise<T> {
  if (process.env.MEDUSA_LOG_BOOT_TIMINGS !== "true") {
    return await run()
  }
  const startedAt = performance.now()
  try {
    return await run()
  } finally {
    console.info(
      `[boot] ${label}: ${Math.round(
        performance.now() - startedAt
      )}ms (done at ${process.uptime().toFixed(2)}s)`
    )
  }
}
