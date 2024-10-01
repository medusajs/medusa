import { FulfillmentDTO } from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"
import {
  StepResponse,
  WorkflowData,
  WorkflowResponse,
  createStep,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { useRemoteQueryStep } from "../../common"
import { updateFulfillmentWorkflow } from "./update-fulfillment"

export const validateFulfillmentDeliverabilityStepId =
  "validate-fulfillment-deliverability"
/**
 * This step validates that if a fulfillment can be marked delivered
 */
export const validateFulfillmentDeliverabilityStep = createStep(
  validateFulfillmentDeliverabilityStepId,
  async (fulfillment: FulfillmentDTO) => {
    if (fulfillment.canceled_at) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Cannot deliver an already canceled fulfillment"
      )
    }

    if (fulfillment.delivered_at) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Fulfillment has already been marked delivered"
      )
    }

    return new StepResponse(void 0)
  }
)

export const markFulfillmentAsDeliveredWorkflowId =
  "mark-fulfillment-as-delivered-workflow"
/**
 * This workflow marks fulfillment as delivered.
 */
export const markFulfillmentAsDeliveredWorkflow = createWorkflow(
  markFulfillmentAsDeliveredWorkflowId,
  ({ id }: WorkflowData<{ id: string }>) => {
    const fulfillment = useRemoteQueryStep({
      entry_point: "fulfillment",
      fields: ["id", "delivered_at", "canceled_at"],
      variables: { id },
      throw_if_key_not_found: true,
      list: false,
    })

    validateFulfillmentDeliverabilityStep(fulfillment)

    const updateInput = transform({ id }, ({ id }) => ({
      id,
      delivered_at: new Date(),
    }))

    return new WorkflowResponse(
      updateFulfillmentWorkflow.runAsStep({ input: updateInput })
    )
  }
)
