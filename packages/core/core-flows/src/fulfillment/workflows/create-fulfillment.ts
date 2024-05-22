import { FulfillmentDTO, FulfillmentWorkflow } from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { createFulfillmentStep } from "../steps"
import { Modules } from "@medusajs/utils"
import { createLinkStep } from "../../common"

export const createFulfillmentWorkflowId = "create-fulfillment-workflow"
export const createFulfillmentWorkflow = createWorkflow(
  createFulfillmentWorkflowId,
  (
    input: WorkflowData<FulfillmentWorkflow.CreateFulfillmentWorkflowInput>
  ): WorkflowData<FulfillmentDTO> => {
    const fulfillment = createFulfillmentStep(input)

    const link = transform(
      { order_id: input.order_id, fulfillment },
      (data) => {
        return [
          {
            [Modules.ORDER]: { order_id: data.order_id },
            [Modules.FULFILLMENT]: { fulfillment_id: data.fulfillment.id },
          },
        ]
      }
    )

    createLinkStep(link)

    return fulfillment
  }
)
