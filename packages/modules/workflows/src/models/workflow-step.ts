import { model } from "@medusajs/framework/utils"

/**
 * One step of a run, written once per transition.
 */
export const WorkflowStep = model
  .define("workflow_step", {
    run_id: model.text().primaryKey(),
    step_id: model.text().primaryKey(),
    status: model.text(),
    attempt: model.number().default(0),
    has_output: model.boolean().default(false),
    output: model.json().nullable(),
    compensate_input: model.json().nullable(),
    error: model.json().nullable(),
    skip_reason: model.text().nullable(),
    pending_failure: model.json().nullable(),
    started_at: model.dateTime().nullable(),
    finished_at: model.dateTime().nullable(),
    owner: model.text().nullable(),
  })
  .indexes([
    {
      name: "IDX_workflow_step_owner",
      on: ["owner"],
      where: "status = 'waiting' AND owner IS NOT NULL",
    },
  ])
