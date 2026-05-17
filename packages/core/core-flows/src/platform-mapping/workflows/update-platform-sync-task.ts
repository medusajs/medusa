import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { updatePlatformSyncTaskStep } from "../steps/update-platform-sync-task"

export const updatePlatformSyncTaskWorkflow = createWorkflow(
  "update-platform-sync-task",
  (input: WorkflowData<{ id: string; [key: string]: unknown }>) => {
    const platformSyncTask = updatePlatformSyncTaskStep(input)
    return new WorkflowResponse(platformSyncTask)
  }
)
