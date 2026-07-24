import type { OrderDTO } from "@medusajs/framework/types"
import { OrderWorkflowEvents } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common/steps/emit-event"
import { archiveOrdersStep } from "../steps"

/**
 * The details of the orders to archive.
 */
export type ArchiveOrdersWorkflowInput = {
  /**
   * The IDs of the orders to archive.
   */
  orderIds: string[]
}

/**
 * The archived orders.
 */
export type ArchiveOrdersWorkflowOutput = OrderDTO[]

export const archiveOrderWorkflowId = "archive-order-workflow"
/**
 * This workflow archives one or more orders. It's used by the
 * [Archive Order Admin API Route](https://docs.medusajs.com/api/admin/orders/archive-an-order).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to wrap custom logic around archiving orders.
 *
 * @example
 * const { result } = await archiveOrderWorkflow(container)
 * .run({
 *   input: {
 *     orderIds: ["order_123"]
 *   }
 * })
 *
 * @summary
 *
 * Archive one or more orders.
 */
export const archiveOrderWorkflow = createWorkflow(
  archiveOrderWorkflowId,
  (
    input: WorkflowData<ArchiveOrdersWorkflowInput>
  ): WorkflowResponse<ArchiveOrdersWorkflowOutput> => {
    const eventData = transform({ input }, (data) => {
      return data.input.orderIds.map((id) => ({ id }))
    })

    emitEventStep({
      eventName: OrderWorkflowEvents.ARCHIVED,
      data: eventData,
    })

    return new WorkflowResponse(archiveOrdersStep(input))
  }
)
