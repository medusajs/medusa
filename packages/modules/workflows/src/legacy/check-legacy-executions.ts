import type { Logger } from "@medusajs/framework/types"
import type { SqlClient } from "@medusajs/workflow-engine/postgres"

const LEGACY_ACTIVE_STATES = [
  "not_started",
  "invoking",
  "waiting_to_compensate",
  "compensating",
]
const LOGGED_IDS = 20

/**
 * Runs from the previous engine are never resumed, so unfinished ones are
 * only reported.
 */
export async function checkLegacyExecutions(
  client: SqlClient,
  logger: Pick<Logger, "warn">
) {
  const { rows } = await client.query<{ exists: string | null }>(
    `SELECT to_regclass('workflow_execution')::text AS exists`
  )
  if (!rows[0]?.exists) {
    return
  }

  const { rows: active } = await client.query<{
    workflow_id: string
    transaction_id: string
    total: number | string
  }>(
    `SELECT workflow_id, transaction_id, count(*) OVER () AS total
     FROM workflow_execution
     WHERE state = ANY($1::text[]) AND deleted_at IS NULL
     ORDER BY updated_at ASC
     LIMIT ${LOGGED_IDS}`,
    [LEGACY_ACTIVE_STATES]
  )
  if (!active.length) {
    return
  }

  const total = Number(active[0].total)
  const ids = active
    .map((row) => `${row.workflow_id}:${row.transaction_id}`)
    .join(", ")
  const more = total > active.length ? ` and ${total - active.length} more` : ""
  logger.warn(
    `${total} unfinished executions from the previous workflow engine were found; they won't be resumed: ${ids}${more}`
  )
}
