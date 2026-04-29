import {
  createWorkflow,
  parallelize,
  WorkflowData,
} from "@medusajs/framework/workflows-sdk"
import { AdditionalData } from "@medusajs/types"
import { refreshCartItemsWorkflow } from "../../cart/workflows/refresh-cart-items"
import { acquireLockStep, releaseLockStep } from "../../locking"
import { deleteLineItemsStep } from "../steps/delete-line-items"
import { emitEventStep } from "../../common/steps/emit-event"
import { CartWorkflowEvents } from "@medusajs/framework/utils"

/**
 * The data to delete line items from a cart.
 */
export type DeleteLineItemsWorkflowInput = {
  /**
   * The cart's ID.
   */
  cart_id: string
  /**
   * The IDs of the line items to delete.
   */
  ids: string[]
}

export const deleteLineItemsWorkflowId = "delete-line-items"
/**
 * This workflow deletes line items from a cart. It's used by the
 * [Delete Line Item Store API Route](https://docs.medusajs.com/api/store#carts_deletecartsidlineitemsline_id).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to
 * delete line items from a cart within your custom flows.
 *
 * @example
 * const { result } = await deleteLineItemsWorkflow(container)
 * .run({
 *   input: {
 *     cart_id: "cart_123",
 *     ids: ["li_123"]
 *   }
 * })
 *
 * @summary
 *
 * Delete line items from a cart.
 */
export const deleteLineItemsWorkflow = createWorkflow(
  {
    name: deleteLineItemsWorkflowId,
    idempotent: false,
  },
  (input: WorkflowData<DeleteLineItemsWorkflowInput & AdditionalData>) => {
    acquireLockStep({
      key: input.cart_id,
      timeout: 2,
      ttl: 10,
    })

    deleteLineItemsStep(input.ids)

    parallelize(
      refreshCartItemsWorkflow.runAsStep({
        input: {
          cart_id: input.cart_id,
          additional_data: input.additional_data,
        },
      }),
      emitEventStep({
        eventName: CartWorkflowEvents.UPDATED,
        data: { id: input.cart_id },
      })
    )

    releaseLockStep({
      key: input.cart_id,
    })
  }
)
