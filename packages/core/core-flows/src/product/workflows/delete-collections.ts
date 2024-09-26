import { ProductCollectionWorkflowEvents } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common"
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

    const collectionIdEvents = transform({ input }, ({ input }) => {
      return input.ids?.map((id) => {
        return { id }
      })
    })

    emitEventStep({
      eventName: ProductCollectionWorkflowEvents.DELETED,
      data: collectionIdEvents,
    })

    const collectionsDeleted = createHook("collectionsDeleted", {
      ids: input.ids,
    })

    return new WorkflowResponse(deletedCollections, {
      hooks: [collectionsDeleted],
    })
  }
)
