import type { FulfillmentDTO } from "@medusajs/framework/types"
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
import { acquireLockStep, releaseLockStep } from "../../locking"

export const validateFulfillmentDeliverabilityStepId =
  "validate-fulfillment-deliverability"
/**
 * This step validates that a fulfillment can be marked delivered.
 * If the fulfillment has already been canceled or delivered, the step will throw an error.
 *
 * :::note
 *
 * You can retrieve a fulfillment's details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 *
 * :::
 *
 * @example
 * const data = validateFulfillmentDeliverabilityStep({
 *   id: "ful_123",
 *   // other fulfillment data...
 * })
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

/**
 * The data to mark a fulfillment as delivered.
 */
export type MarkFulfillmentAsDeliveredInput = {
  /**
   * The fulfillment's ID.
   */
  id: string
}

export const markFulfillmentAsDeliveredWorkflowId =
  "mark-fulfillment-as-delivered-workflow"
/**
 * This workflow marks a fulfillment as delivered. It's used by the {@link markOrderFulfillmentAsDeliveredWorkflow}.
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you
 * to mark a fulfillment as delivered in your custom flows.
 *
 * @example
 * const { result } = await markFulfillmentAsDeliveredWorkflow(container)
 * .run({
 *   input: {
 *     id: "ful_123",
 *   }
 * })
 *
 * @summary
 *
 * Mark a fulfillment as delivered.
 */
export const markFulfillmentAsDeliveredWorkflow = createWorkflow(
  markFulfillmentAsDeliveredWorkflowId,
  ({ id }: WorkflowData<MarkFulfillmentAsDeliveredInput>) => {
    acquireLockStep({
      key: id,
      timeout: 2,
      ttl: 10,
    })

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

    const updatedFulfillment = updateFulfillmentWorkflow.runAsStep({
      input: updateInput,
    })

    releaseLockStep({
      key: id,
    })
    return new WorkflowResponse(updatedFulfillment)
  }
)
