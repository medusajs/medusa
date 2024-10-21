import { OrderDTO } from "@medusajs/framework/types"
import { OrderWorkflowEvents } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common/steps/emit-event"
import { archiveOrdersStep } from "../steps"

export type ArchiveOrdersWorkflowInput = {
  orderIds: string[]
}

export const archiveOrderWorkflowId = "archive-order-workflow"
/**
 * This workflow archives an order.
 */
export const archiveOrderWorkflow = createWorkflow(
  archiveOrderWorkflowId,
  (
    input: WorkflowData<ArchiveOrdersWorkflowInput>
  ): WorkflowResponse<OrderDTO[]> => {
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
