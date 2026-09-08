import { Modules, RegionWorkflowEvents } from "@medusajs/framework/utils"
import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common/steps/emit-event"
import { removeRemoteLinkStep } from "../../common/steps/remove-remote-links"
import { deleteRegionsStep } from "../steps"

export type DeleteRegionsWorkflowInput = { ids: string[] }

export const deleteRegionsWorkflowId = "delete-regions"
/**
 * This workflow deletes one or more regions. It's used by the
 * [Delete Region Admin API Route](https://docs.medusajs.com/api/admin/regions/delete-a-region).
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you
 * to delete regions in your custom flows.
 *
 * @example
 * const { result } = await deleteRegionsWorkflow(container)
 * .run({
 *   input: {
 *     ids: ["reg_123"]
 *   }
 * })
 *
 * @summary
 *
 * Delete one or more regions.
 */
export const deleteRegionsWorkflow = createWorkflow(
  deleteRegionsWorkflowId,
  (input: WorkflowData<DeleteRegionsWorkflowInput>): WorkflowData<void> => {
    deleteRegionsStep(input.ids)

    const regionIdEvents = transform({ input }, ({ input }) => {
      return input.ids?.map((id) => {
        return { id }
      })
    })

    removeRemoteLinkStep({
      [Modules.REGION]: {
        region_id: input.ids,
      },
    })

    emitEventStep({
      eventName: RegionWorkflowEvents.DELETED,
      data: regionIdEvents,
    })
  }
)
