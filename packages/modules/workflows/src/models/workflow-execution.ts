import { model, TransactionState } from "@medusajs/framework/utils"

/**
 * The shape executions are listed in. It has no table: list and retrieve read
 * the run tables and map them to it. It is not exported from the models
 * folder, so no migration creates it.
 */
export const WorkflowExecution = model.define("workflow_execution", {
  id: model.id({ prefix: "wf_exec" }).primaryKey(),
  // As before, executions can be linked by any of these.
  workflow_id: model.text().primaryKey(),
  transaction_id: model.text().primaryKey(),
  run_id: model.text().primaryKey(),
  execution: model.json().nullable(),
  context: model.json().nullable(),
  state: model.enum(TransactionState),
  retention_time: model.number().nullable(),
})
