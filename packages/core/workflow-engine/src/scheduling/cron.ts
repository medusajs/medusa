import parser from "cron-parser"

/**
 * The first fire time strictly after `after`, or null if there is none.
 */
export function nextFireTime(
  spec: { cron?: string | null; intervalMs?: number | null },
  after: Date
): Date | null {
  if (spec.cron) {
    const iterator = parser.parseExpression(spec.cron, { currentDate: after })
    return iterator.hasNext() ? iterator.next().toDate() : null
  }
  if (spec.intervalMs) {
    return new Date(after.getTime() + spec.intervalMs)
  }
  return null
}
