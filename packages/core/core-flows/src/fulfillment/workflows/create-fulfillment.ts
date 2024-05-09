import { FulfillmentDTO, FulfillmentWorkflow } from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { createFulfillmentStep } from "../steps"
import { linkOrderFulfillmentStep } from "../steps/link-order-fulfillment"

export const createFulfillmentWorkflowId = "create-fulfillment-workflow"
export const createFulfillmentWorkflow = createWorkflow(
  createFulfillmentWorkflowId,
  (
    input: WorkflowData<FulfillmentWorkflow.CreateFulfillmentWorkflowInput>
  ): WorkflowData<FulfillmentDTO> => {
    const fulfillment = createFulfillmentStep(input)

    const linksToCreate = transform({ fulfillment, input }, (data) => [
      {
        order_id: data.input.order_id,
        fulfillment_id: data.fulfillment.id,
      },
    ])

    linkOrderFulfillmentStep({ links: linksToCreate })

    return fulfillment
  }
)
