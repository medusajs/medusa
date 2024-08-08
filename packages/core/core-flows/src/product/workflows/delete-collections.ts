import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { deleteCollectionsStep } from "../steps"

export type DeleteCollectionsWorkflowInput = { ids: string[] }

export const deleteCollectionsWorkflowId = "delete-collections"
/**
 * This workflow deletes one or more collection.
 */
export const deleteCollectionsWorkflow = createWorkflow(
  deleteCollectionsWorkflowId,
  (input: WorkflowData<DeleteCollectionsWorkflowInput>) => {
    const deletedCollections = deleteCollectionsStep(input.ids)
    const collectionsDeleted = createHook("collectionsDeleted", {
      ids: input.ids,
    })

    return new WorkflowResponse(deletedCollections, {
      hooks: [collectionsDeleted],
    })
  }
)
