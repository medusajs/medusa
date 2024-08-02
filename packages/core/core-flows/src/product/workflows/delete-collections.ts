import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { deleteCollectionsStep } from "../steps"

type WorkflowInput = { ids: string[] }

export const deleteCollectionsWorkflowId = "delete-collections"

export const deleteCollectionsWorkflow = createWorkflow(
  deleteCollectionsWorkflowId,
  (input: WorkflowData<WorkflowInput>) => {
    const deletedCollections = deleteCollectionsStep(input.ids)
    const collectionsDeleted = createHook("collectionsDeleted", {
      ids: input.ids,
    })

    return new WorkflowResponse(deletedCollections, {
      hooks: [collectionsDeleted],
    })
  }
)
