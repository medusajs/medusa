import { model } from "@medusajs/framework/utils"

/**
 * Messages staged by a run, published when its root run succeeds. A message
 * that keeps failing to publish ends up `dead` and is kept for inspection.
 */
export const WorkflowOutbox = model
  .define("workflow_outbox", {
    id: model.text().primaryKey(),
    group_id: model.text(),
    run_id: model.text(),
    step_id: model.text().nullable(),
    attempt: model.number().nullable(),
    status: model.text().default("staged"),
    message: model.json(),
    claimed_by: model.text().nullable(),
    claimed_until: model.dateTime().nullable(),
    attempts: model.number().default(0),
    last_error: model.json().nullable(),
  })
  .indexes([
    { name: "IDX_workflow_outbox_group_id", on: ["group_id"], where: null },
    { name: "IDX_workflow_outbox_run_id", on: ["run_id"], where: null },
    {
      name: "IDX_workflow_outbox_ready",
      on: ["id"],
      where: "status = 'ready'",
    },
    {
      name: "IDX_workflow_outbox_staged",
      on: ["created_at"],
      where: "status = 'staged'",
    },
    {
      name: "IDX_workflow_outbox_dead",
      on: ["updated_at"],
      where: "status = 'dead'",
    },
  ])
