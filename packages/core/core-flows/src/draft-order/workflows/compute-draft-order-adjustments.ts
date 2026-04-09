import { ChangeActionType, OrderChangeStatus } from "@medusajs/framework/utils"
import {
  createWorkflow,
  transform,
  when,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import type {
  OrderChangeDTO,
  OrderDTO,
  PromotionDTO,
} from "@medusajs/framework/types"
import {
  getActionsToComputeFromPromotionsStep,
  prepareAdjustmentsFromPromotionActionsStep,
} from "../../cart"
import { createOrderChangeActionsWorkflow } from "../../order/workflows/create-order-change-actions"
import { previewOrderChangeStep } from "../../order/steps/preview-order-change"
import { validateDraftOrderChangeStep } from "../steps/validate-draft-order-change"
import { draftOrderFieldsForRefreshSteps } from "../utils/fields"
import { useRemoteQueryStep } from "../../common"
import { acquireLockStep, releaseLockStep } from "../../locking"
import { deleteOrderChangeActionsStep } from "../../order/steps/delete-order-change-actions"
import { prepareOrderComputeActionContextStep } from "../../order/workflows/order-edit/utils/prepare-order-compute-action-context"

export const computeDraftOrderAdjustmentsWorkflowId =
  "compute-draft-order-adjustments"

/**
 * The details of the draft order to refresh the adjustments for.
 */
export interface ComputeDraftOrderAdjustmentsWorkflowInput {
  /**
   * The ID of the draft order to refresh the adjustments for.
   */
  order_id: string
}

/**
 * This workflow computes the adjustments or promotions for a draft order. It's used by other workflows
 * to compute new adjustments for the promotions whenever changes are made to the draft order.
 * Created adjustments are "virtual" meaning they live on the action and no line item adjustments records are created
 * in the database until the edit is confirmed.
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to wrap custom logic around
 * computing the adjustments for a draft order.
 *
 * @example
 * const { result } = await computeDraftOrderAdjustmentsWorkflow(container)
 * .run({
 *   input: {
 *     order_id: "order_123",
 *   }
 * })
 *
 * @summary
 *
 * Refresh the promotions in a draft order.
 */
export const computeDraftOrderAdjustmentsWorkflow = createWorkflow(
  computeDraftOrderAdjustmentsWorkflowId,
  function (input: WorkflowData<ComputeDraftOrderAdjustmentsWorkflowInput>) {
    acquireLockStep({
      key: input.order_id,
      timeout: 2,
      ttl: 10,
    })

    const order: OrderDTO & { promotions: PromotionDTO[] } = useRemoteQueryStep(
      {
        entry_point: "orders",
        fields: draftOrderFieldsForRefreshSteps,
        variables: { id: input.order_id },
        list: false,
        throw_if_key_not_found: true,
      }
    ).config({ name: "order-query" })

    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: ["id", "status", "version", "actions.*"],
      variables: {
        filters: {
          order_id: input.order_id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({ name: "order-change-query" })

    validateDraftOrderChangeStep({ order, orderChange })

    const toDeleteActions = transform(orderChange, (orderChange) => {
      return orderChange.actions
        .filter(
          (action) =>
            action.action === ChangeActionType.ITEM_ADJUSTMENTS_REPLACE
        )
        .map((action) => {
          return action.id
        })
    })

    when(toDeleteActions, (toDeleteActions) => toDeleteActions.length > 0).then(
      () => {
        // clean up old replace actions from the current order change
        deleteOrderChangeActionsStep({ ids: toDeleteActions })
      }
    )

    const previewedOrder = previewOrderChangeStep(input.order_id)

    when(
      { order },
      ({ order }) => Array.isArray(order.promotions) && !order.promotions.length
    ).then(() => {
      const orderChangeActionAdjustmentsInput = transform(
        { order, previewedOrder, orderChange },
        ({ order, previewedOrder, orderChange }) => {
          return previewedOrder.items.map((item) => {
            return {
              order_id: order.id,
              order_change_id: orderChange.id,
              version: orderChange.version,
              action: ChangeActionType.ITEM_ADJUSTMENTS_REPLACE,
              details: {
                reference_id: item.id,
                adjustments: [],
              },
            }
          })
        }
      )

      createOrderChangeActionsWorkflow
        .runAsStep({ input: orderChangeActionAdjustmentsInput })
        .config({ name: "order-change-action-adjustments-input-remove" })
    })

    when({ order }, ({ order }) => !!order.promotions?.length).then(() => {
      const orderPromotions = transform({ order }, ({ order }) => {
        return order.promotions
          .map((p) => p.code)
          .filter((p) => p !== undefined)
      })

      const actionsToComputeItemsInput = prepareOrderComputeActionContextStep({
          order,
          previewedOrder,
        })

      const actions = getActionsToComputeFromPromotionsStep({
        computeActionContext: actionsToComputeItemsInput,
        promotionCodesToApply: orderPromotions,
      })

      const { lineItemAdjustmentsToCreate } =
        prepareAdjustmentsFromPromotionActionsStep({ actions })

      const orderChangeActionAdjustmentsInput = transform(
        {
          order,
          previewedOrder,
          orderChange,
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

    releaseLockStep({
      key: input.order_id,
    })

    return new WorkflowResponse(void 0)
  }
)
