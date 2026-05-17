import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { createPlatformSyncTaskStep } from "../steps/create-platform-sync-task"

export const createPlatformSyncTaskWorkflow = createWorkflow(
  "create-platform-sync-task",
  (
    input: WorkflowData<{
      shop_id: string
      platform_type: string
      action: string
      payload: Record<string, unknown>
      [key: string]: unknown
    }>
  ) => {
    const platformSyncTask = createPlatformSyncTaskStep(input)
    return new WorkflowResponse(platformSyncTask)
  }
)
