import { CORE_POLICY_RESOURCES } from "@medusajs/framework/types"
import { buildPolicies } from "@medusajs/framework/utils"

/**
 * The fully expanded core policy list, one policy per
 * `(core resource, core operation)` pair. Keys, names and descriptions are
 * derived deterministically so that re-running the sync against a database
 * seeded by an earlier Medusa version is a no-op.
 */
export const CORE_POLICY_DEFINITIONS = buildPolicies({
  resource: CORE_POLICY_RESOURCES,
})
