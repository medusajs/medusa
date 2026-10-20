import { model } from "@medusajs/framework/utils"

/**
 * Instances that heartbeat, when recovery is on.
 */
export const WorkflowWorker = model
  .define("workflow_worker", {
    id: model.text().primaryKey(),
    mode: model.text(),
    started_at: model.dateTime(),
    heartbeat_at: model.dateTime(),
  })
  .indexes([
    {
      name: "IDX_workflow_worker_heartbeat_at",
      on: ["heartbeat_at"],
      where: null,
    },
  ])
