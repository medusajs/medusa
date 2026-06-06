import type { OrderChangeActionDTO } from "@zjedene-medusa/framework/types"

import { ChangeActionType, MedusaError } from "@zjedene-medusa/framework/utils"
import { createStep } from "@zjedene-medusa/framework/workflows-sdk"
import type { OrderChangeDTO, OrderWorkflow } from "@zjedene-medusa/framework/types"

/**
 * The details of the draft order and its change to validate.
 */
export interface ValidateDraftOrderUpdateActionItemStepInput {
  /**
   * The details of the item removal action.
   */
  input: OrderWorkflow.DeleteOrderEditItemActionWorkflowInput
  /**
   * The order change to validate.
   */
  orderChange: OrderChangeDTO
}

/**
 * This step validates that an item change can be removed from a draft order edit. It throws an error if the
 * item change is not in the draft order edit, or if the item change is not adding or updating an item.
 *
 * :::note
 *
 * You can retrieve a draft order change's details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 *
 * :::
 *
 * @example
 * const data = validateDraftOrderRemoveActionItemStep({
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
export const validateDraftOrderRemoveActionItemStep = createStep(
  "validate-draft-order-remove-action-item",
  async function ({
    input,
    orderChange,
  }: ValidateDraftOrderUpdateActionItemStepInput) {
    const associatedAction = (orderChange.actions ?? []).find(
      (a) => a.id === input.action_id
    ) as OrderChangeActionDTO

    if (!associatedAction) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `No item found for order ${input.order_id} in order change ${orderChange.id}`
      )
    }

    if (
      ![ChangeActionType.ITEM_ADD, ChangeActionType.ITEM_UPDATE].includes(
        associatedAction.action as ChangeActionType
      )
    ) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Action ${associatedAction.id} is not adding or updating an item`
      )
    }
  }
)
