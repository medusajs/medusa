import { TransactionState } from "@zjedene-medusa/framework/orchestration"
import { model } from "@zjedene-medusa/framework/utils"

export const WorkflowExecution = model
  .define("workflow_execution", {
    id: model.id({ prefix: "wf_exec" }),
    workflow_id: model.text().primaryKey(),
    transaction_id: model.text().primaryKey(),
    run_id: model.text().primaryKey(),
    execution: model.json().nullable(),
    context: model.json().nullable(),
    state: model.enum(TransactionState),
    retention_time: model.number().nullable(),
  })
  .indexes([
    {
      on: ["id"],
      where: "deleted_at IS NULL",
    },
    {
      on: ["workflow_id"],
      where: "deleted_at IS NULL",
    },
    {
      on: ["transaction_id"],
      where: "deleted_at IS NULL",
    },
    {
      on: ["workflow_id", "transaction_id", "run_id"],
      unique: true,
      where: "deleted_at IS NULL",
    },
    {
      on: ["state"],
      where: "deleted_at IS NULL",
    },
    {
      on: ["run_id"],
      where: "deleted_at IS NULL",
    },
    {
      on: ["workflow_id", "transaction_id"],
      where: "deleted_at IS NULL",
    },
    {
      on: ["state", "updated_at"],
      where: "deleted_at IS NULL",
    },
    {
      on: ["retention_time", "updated_at", "state"],
      where: "deleted_at IS NULL AND retention_time IS NOT NULL",
    },
    {
      on: ["updated_at", "retention_time"],
      where:
        "deleted_at IS NULL AND retention_time IS NOT NULL AND state IN ('done', 'failed', 'reverted')",
    },
  ])
