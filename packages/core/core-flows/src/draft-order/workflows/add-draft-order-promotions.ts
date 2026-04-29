import {
  ChangeActionType,
  OrderChangeStatus,
  PromotionActions,
} from "@medusajs/framework/utils"
import {
  createWorkflow,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  OrderChangeDTO,
  OrderDTO,
  PromotionDTO,
} from "@medusajs/framework/types"
import { useRemoteQueryStep } from "../../common"
import {
  createOrderChangeActionsWorkflow,
  previewOrderChangeStep,
} from "../../order"
import { validateDraftOrderChangeStep } from "../steps/validate-draft-order-change"
import { validatePromoCodesToAddStep } from "../steps/validate-promo-codes-to-add"
import { updateDraftOrderPromotionsStep } from "../steps/update-draft-order-promotions"
import { computeDraftOrderAdjustmentsWorkflow } from "./compute-draft-order-adjustments"
import { draftOrderFieldsForRefreshSteps } from "../utils/fields"
import { acquireLockStep, releaseLockStep } from "../../locking"

export const addDraftOrderPromotionWorkflowId = "add-draft-order-promotion"

/**
 * The details of the promotions to add to a draft order.
 */
export interface AddDraftOrderPromotionWorkflowInput {
  /**
   * The ID of the draft order to add the promotions to.
   */
  order_id: string
  /**
   * The codes of the promotions to add to the draft order.
   */
  promo_codes: string[]
}

/**
 * This workflow adds promotions to a draft order. It's used by the
 * [Add Promotion to Draft Order Admin API Route](https://docs.medusajs.com/api/admin#draft-orders_postdraftordersideditpromotions).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to wrap custom logic around adding promotions to
 * a draft order.
 *
 * @example
 * const { result } = await addDraftOrderPromotionWorkflow(container)
 * .run({
 *   input: {
 *     order_id: "order_123",
 *     promo_codes: ["PROMO_CODE_1", "PROMO_CODE_2"]
 *   }
 * })
 *
 * @summary
 *
 * Add promotions to a draft order.
 */
export const addDraftOrderPromotionWorkflow = createWorkflow(
  addDraftOrderPromotionWorkflowId,
  function (input: WorkflowData<AddDraftOrderPromotionWorkflowInput>) {
    acquireLockStep({
      key: input.order_id,
      timeout: 2,
      ttl: 10,
    })

    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: draftOrderFieldsForRefreshSteps,
      variables: {
        id: input.order_id,
      },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-query" })

    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: ["id", "status", "version"],
      variables: {
        filters: {
          order_id: input.order_id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({ name: "order-change-query" })

    validateDraftOrderChangeStep({ order, orderChange })

    const promotions: PromotionDTO[] = useRemoteQueryStep({
      entry_point: "promotion",
      fields: ["id", "code", "status"],
      variables: {
        filters: {
          code: input.promo_codes,
        },
      },
      list: true,
    }).config({ name: "promotions-query" })

    validatePromoCodesToAddStep({
      promo_codes: input.promo_codes,
      promotions,
    })

    updateDraftOrderPromotionsStep({
      id: input.order_id,
      promo_codes: input.promo_codes,
      action: PromotionActions.ADD,
    })

    const orderChangeActionInput = transform(
      { order, orderChange, promotions },
      ({ order, orderChange, promotions }) => {
        return promotions.map((promotion) => ({
          action: ChangeActionType.PROMOTION_ADD,
          reference: "order_promotion",
          order_change_id: orderChange.id,
          reference_id: promotion.id,
          order_id: order.id,
          details: {
            added_code: promotion.code,
          },
        }))
      }
    )

    createOrderChangeActionsWorkflow.runAsStep({
      input: orderChangeActionInput,
    })

    computeDraftOrderAdjustmentsWorkflow.runAsStep({
      input: {
        order_id: input.order_id,
      },
    })

    releaseLockStep({
      key: input.order_id,
    })

    return new WorkflowResponse(previewOrderChangeStep(input.order_id))
  }
)
