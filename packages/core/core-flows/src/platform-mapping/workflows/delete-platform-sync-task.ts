import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { deletePlatformSyncTaskStep } from "../steps/delete-platform-sync-task"

export const deletePlatformSyncTaskWorkflow = createWorkflow(
  "delete-platform-sync-task",
  (input: WorkflowData<{ id: string }>) => {
    deletePlatformSyncTaskStep(input)
    return new WorkflowResponse(void 0)
  }
)
