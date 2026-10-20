import type { WorkflowsModuleOptions } from "../../src/types"

/**
 * The store the integration tests run against. The suite runs once on
 * Postgres and once with `WORKFLOWS_TEST_STORE=memory`, the store for
 * single-instance setups without crash recovery.
 */
export const testStore: Pick<WorkflowsModuleOptions, "store"> = process.env
  .WORKFLOWS_TEST_STORE
  ? { store: process.env.WORKFLOWS_TEST_STORE as "postgres" | "memory" }
  : {}
