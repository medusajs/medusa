import { model } from "@medusajs/framework/utils"

/**
 * One run of a workflow. The engine reads and writes it with its own SQL; the
 * model exists for migrations.
 */
export const WorkflowRun = model
  .define("workflow_run", {
    id: model.text().primaryKey(),
    workflow_id: model.text(),
    transaction_id: model.text(),
    status: model.text(),
    durability: model.text(),
    definition_hash: model.text(),
    input: model.json().nullable(),
    context: model.json().nullable(),
    metadata: model.json().nullable(),
    result: model.json().nullable(),
    errors: model.json().nullable(),
    flags: model.json().nullable(),
    parent_run_id: model.text().nullable(),
    parent_step_id: model.text().nullable(),
    idempotent: model.boolean().default(false),
    // Milliseconds, as text: DML has no 64-bit integer.
    retention_ms: model.text().nullable(),
    lease_owner: model.text().nullable(),
    lease_token: model.text().nullable(),
    lease_expires_at: model.dateTime().nullable(),
    cancel_requested_at: model.dateTime().nullable(),
    deadline_at: model.dateTime().nullable(),
    retain_until: model.dateTime().nullable(),
    finished_at: model.dateTime().nullable(),
  })
  .indexes([
    {
      name: "IDX_workflow_run_active_transaction",
      on: ["workflow_id", "transaction_id"],
      unique: true,
      where:
        "status NOT IN ('succeeded', 'compensated', 'cancelled', 'failed')",
    },
    {
      name: "IDX_workflow_run_transaction",
      on: ["workflow_id", "transaction_id", "created_at"],
      where: null,
    },
    {
      name: "IDX_workflow_run_parent",
      on: ["parent_run_id"],
      where: "parent_run_id IS NOT NULL",
    },
    {
      name: "IDX_workflow_run_lease",
      on: ["lease_expires_at"],
      where: "status IN ('running', 'compensating')",
    },
    {
      name: "IDX_workflow_run_retain_until",
      on: ["retain_until"],
      where: "retain_until IS NOT NULL",
    },
    {
      name: "IDX_workflow_run_lease_owner",
      on: ["lease_owner"],
      where: "lease_owner IS NOT NULL",
    },
    {
      name: "IDX_workflow_run_created_at",
      on: ["created_at"],
      where: null,
    },
    {
      name: "IDX_workflow_run_updated_at",
      on: ["updated_at"],
      where: null,
    },
  ])
