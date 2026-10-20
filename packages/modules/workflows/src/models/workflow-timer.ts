import { model } from "@medusajs/framework/utils"

/**
 * Durable work due at a time: resume a run, retry a step, or time out a step
 * or a run.
 */
export const WorkflowTimer = model
  .define("workflow_timer", {
    id: model.text().primaryKey(),
    kind: model.text(),
    run_id: model.text(),
    step_id: model.text().nullable(),
    attempt: model.number().nullable(),
    workflow_id: model.text(),
    definition_hash: model.text(),
    due_at: model.dateTime(),
    generation: model.number().default(1),
    claimed_by: model.text().nullable(),
    claimed_until: model.dateTime().nullable(),
  })
  .indexes([
    {
      name: "IDX_workflow_timer_workflow_due_at",
      on: ["workflow_id", "due_at"],
      where: null,
    },
    {
      name: "IDX_workflow_timer_run_kind",
      on: ["run_id", "kind"],
      where: null,
    },
  ])
