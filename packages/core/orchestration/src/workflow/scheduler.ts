import { MedusaError } from "@medusajs/utils"
import { IDistributedSchedulerStorage, SchedulerOptions } from "../transaction"
import { WorkflowDefinition } from "./workflow-manager"

export class WorkflowScheduler {
  private static keyValueStore: IDistributedSchedulerStorage
  public static setStorage(storage: IDistributedSchedulerStorage) {
    this.keyValueStore = storage
  }

  public async scheduleWorkflow(workflow: WorkflowDefinition) {
    const schedule = workflow.options?.schedule
    if (!schedule) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Workflow schedule is not defined while registering a scheduled workflow"
      )
    }

    const normalizedSchedule: SchedulerOptions =
      typeof schedule === "string"
        ? {
            cron: schedule,
            concurrency: "forbid",
          }
        : {
            cron: schedule.cron,
            concurrency: schedule.concurrency || "forbid",
            numberOfExecutions: schedule.numberOfExecutions,
          }

    await WorkflowScheduler.keyValueStore.scheduleJob(
      workflow.id,
      normalizedSchedule
    )
  }

  public async clearWorkflow(workflow: WorkflowDefinition) {
    await WorkflowScheduler.keyValueStore.cancelJob(workflow.id)
  }

  public async clear() {
    await WorkflowScheduler.keyValueStore.cancelAllJobs()
  }
}
