import { model } from "@medusajs/framework/utils"

export const WorkflowSchedule = model
  .define("workflow_schedule", {
    workflow_id: model.text().primaryKey(),
    cron: model.text().nullable(),
    // Milliseconds, as text: DML has no 64-bit integer.
    interval_ms: model.text().nullable(),
    concurrency: model.text().default("forbid"),
    number_of_executions: model.number().nullable(),
    remaining: model.number().nullable(),
    catch_up: model.boolean().default(true),
    definition_hash: model.text(),
    next_fire_at: model.dateTime().nullable(),
    last_transaction_id: model.text().nullable(),
    last_seen_at: model.dateTime(),
    claimed_by: model.text().nullable(),
    claimed_until: model.dateTime().nullable(),
  })
  .indexes([
    {
      name: "IDX_workflow_schedule_next_fire_at",
      on: ["next_fire_at"],
      where: "next_fire_at IS NOT NULL",
    },
  ])
