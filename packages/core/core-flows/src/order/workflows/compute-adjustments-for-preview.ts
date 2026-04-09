import { OrderChangeDTO, OrderDTO, PromotionDTO } from "@medusajs/framework/types"
import { ChangeActionType } from "@medusajs/framework/utils"
import {
  createWorkflow,
  transform,
  when,
  WorkflowData,
} from "@medusajs/framework/workflows-sdk"
import {
  getActionsToComputeFromPromotionsStep,
  prepareAdjustmentsFromPromotionActionsStep,
} from "../../cart"
import { previewOrderChangeStep } from "../steps/preview-order-change"
import { createOrderChangeActionsWorkflow } from "./create-order-change-actions"
import {
  deleteOrderChangeActionsStep,
  listOrderChangeActionsByTypeStep,
} from "../steps"
import { prepareOrderComputeActionContextStep } from "./order-edit/utils/prepare-order-compute-action-context"

/**
 * The data to compute adjustments for an order edit, exchange, claim, or return.
 */
export type ComputeAdjustmentsForPreviewWorkflowInput = {
  /**
   * The order's details.
   */
  order: OrderDTO & {
    /**
     * The promotions applied to the order.
     */
    promotions: PromotionDTO[]
  }
  /**
   * The order change's details.
   */
  orderChange: OrderChangeDTO
}

export const computeAdjustmentsForPreviewWorkflowId =
  "compute-adjustments-for-preview"
/**
 * This workflow computes adjustments for an order change if the carry over promotions flag is true on the order change.
 * If the flag is false, it deletes the existing adjustments replacement actions.
 *
 * It is currently used as a part of the order edit and exchange flows. It's used by workflows
 * like {@link orderExchangeAddNewItemWorkflow} and {@link orderEditAddNewItemWorkflow}.
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to compute adjustments
 * in your custom flows.
 *
 * @since 2.12.0
 *
 * @example
 * const { result } = await computeAdjustmentsForPreviewWorkflow(container)
 * .run({
 *   input: {
 *     order: {
 *       id: "order_123",
 *       // other order details...
 *     },
 *     orderChange: {
 *       id: "orch_123",
 *       // other order change details...
 *     },
 *   }
 * })
 *
 * @summary
 *
 * Compute adjustments for an order edit, exchange, claim, or return.
 */
export const computeAdjustmentsForPreviewWorkflow = createWorkflow(
  computeAdjustmentsForPreviewWorkflowId,
  function (input: WorkflowData<ComputeAdjustmentsForPreviewWorkflowInput>) {
    const previewedOrder = previewOrderChangeStep(input.order.id)

    when(
      { order: input.order, orderChange: input.orderChange },
      ({ order, orderChange }) =>
        /**
         * Compute adjustments only if the flag on the order change is true
         */
        !!order.promotions.length && !!orderChange.carry_over_promotions
    ).then(() => {
      const actionsToComputeItemsInput = prepareOrderComputeActionContextStep({
        order: input.order,
        previewedOrder,
      })

      const orderPromotions = transform({ order: input.order }, ({ order }) => {
        return order.promotions
          .map((p) => p.code)
          .filter((p) => p !== undefined)
      })

      const actions = getActionsToComputeFromPromotionsStep({
        computeActionContext: actionsToComputeItemsInput,
        promotionCodesToApply: orderPromotions,
        options: {
          skip_usage_limit_checks: true,
        },
      })

      const { lineItemAdjustmentsToCreate } =
        prepareAdjustmentsFromPromotionActionsStep({ actions })

      const orderChangeActionAdjustmentsInput = transform(
        {
          order: input.order,
          previewedOrder,
          orderChange: input.orderChange,
          lineItemAdjustmentsToCreate,
        },
        ({
          order,
          previewedOrder,
          orderChange,
          lineItemAdjustmentsToCreate,
        }) => {
          return previewedOrder.items.map((item) => {
            const itemAdjustments = lineItemAdjustmentsToCreate.filter(
              (adjustment) => adjustment.item_id === item.id
            )

            return {
              order_change_id: orderChange.id,
              order_id: order.id,
              exchange_id: orderChange.exchange_id ?? undefined,
              claim_id: orderChange.claim_id ?? undefined,
              return_id: orderChange.return_id ?? undefined,
              version: orderChange.version,
              action: ChangeActionType.ITEM_ADJUSTMENTS_REPLACE,
              details: {
                reference_id: item.id,
                adjustments: itemAdjustments,
              },
            }
          })
        }
      )

      createOrderChangeActionsWorkflow
        .runAsStep({ input: orderChangeActionAdjustmentsInput })
        .config({ name: "order-change-action-adjustments-input" })
    })

    when(
      { order: previewedOrder },
      ({ order }) => !order.order_change.carry_over_promotions
    ).then(() => {
      const actionIds = listOrderChangeActionsByTypeStep({
        order_change_id: input.orderChange.id,
        action_type: ChangeActionType.ITEM_ADJUSTMENTS_REPLACE,
      })

      deleteOrderChangeActionsStep({ ids: actionIds })
    })
  }
)
