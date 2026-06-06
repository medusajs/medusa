import { ChangeActionType, MedusaError } from "@zjedene-medusa/framework/utils"
import { createStep } from "@zjedene-medusa/framework/workflows-sdk"
import {
  OrderChangeActionDTO,
  OrderChangeDTO,
  OrderWorkflow,
} from "@zjedene-medusa/framework/types"

/**
 * The details of the draft order and its change to validate.
 */
export interface ValidateDraftOrderShippingMethodActionStepInput {
  /**
   * The details of the shipping method removal action.
   */
  input: OrderWorkflow.DeleteOrderEditShippingMethodWorkflowInput
  /**
   * The order change to validate.
   */
  orderChange: OrderChangeDTO
}

/**
 * This step validates that a shipping method change can be removed from a draft order edit. It throws an error if the
 * shipping method change is not in the draft order edit, or if the shipping method change is not adding a shipping method.
 *
 * :::note
 *
 * You can retrieve a draft order change's details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 *
 * :::
 *
 * @example
 * const data = validateDraftOrderShippingMethodActionStep({
 *   input: {
 *     action_id: "action_123",
 *     order_id: "order_123",
 *   },
 *   orderChange: {
 *     id: "orch_123",
 *     // other order change details...
 *   }
 * })
 */
export const validateDraftOrderShippingMethodActionStep = createStep(
  "validate-draft-order-shipping-method-action",
  async function ({
    input,
    orderChange,
  }: ValidateDraftOrderShippingMethodActionStepInput) {
    const associatedAction = (orderChange.actions ?? []).find(
      (a) => a.id === input.action_id
    ) as OrderChangeActionDTO

    if (!associatedAction) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `No shipping method found for order ${input.order_id} in order change ${orderChange.id}`
      )
    }

    if (associatedAction.action !== ChangeActionType.SHIPPING_ADD) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Action ${associatedAction.id} is not adding a shipping method`
      )
    }
  }
)
