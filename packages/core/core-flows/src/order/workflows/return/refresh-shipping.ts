import type { OrderChangeDTO } from "@zjedene-medusa/framework/types"
import { ChangeActionType, OrderChangeStatus } from "@zjedene-medusa/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
  when,
} from "@zjedene-medusa/framework/workflows-sdk"

import { maybeRefreshShippingMethodsWorkflow } from "../maybe-refresh-shipping-methods"
import { useQueryGraphStep } from "../../../common"

/**
 * The data to validate that items can be added to a return.
 */
export type RequestItemReturnValidationStepInput = {
  /**
   * The order change's ID.
   */
  order_change_id: string
  /**
   * The return's details.
   */
  return_id: string
  /**
   * The order's ID.
   */
  order_id: string
}

export const refreshReturnShippingWorkflowId = "refresh-return-shipping"
/**
 * This workflow refreshes the shipping method for a return in case the shipping option is calculated.
 *
 * @summary
 *
 * Refresh return shipping.
 */
export const refreshReturnShippingWorkflow = createWorkflow(
  refreshReturnShippingWorkflowId,
  function (
    input: WorkflowData<RequestItemReturnValidationStepInput>
  ): WorkflowResponse<void> {
    const orderChangeQuery = useQueryGraphStep({
      entity: "order_change",
      fields: ["id", "status", "order_id", "return_id", "actions.*"],
      filters: {
        order_id: input.order_id,
        return_id: input.return_id,
        status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
      },
    }).config({ name: "order-change-query" })

    const orderChange: OrderChangeDTO = transform(
      orderChangeQuery,
      ({ data }) => data[0]
    )

    const refreshArgs = transform(
      { input, orderChange },
      ({ input, orderChange }) => {
        const shippingAction = orderChange.actions.find(
          (action) => action.action === ChangeActionType.SHIPPING_ADD
        )

        const items = orderChange.actions
          .filter((action) => action.action === ChangeActionType.RETURN_ITEM)
          .map((a) => ({
            id: a.details?.reference_id as string,
            quantity: a.details?.quantity as number,
          }))

        if (shippingAction) {
          return {
            shipping_method_id: shippingAction.reference_id,
            order_id: orderChange.order_id,
            action_id: shippingAction.id,
            context: {
              return_id: input.return_id,
              return_items: items,
            },
          }
        }

        return null
      }
    )

    when({ refreshArgs }, ({ refreshArgs }) => refreshArgs !== null).then(() =>
      maybeRefreshShippingMethodsWorkflow.runAsStep({
        input: refreshArgs,
      })
    )

    return new WorkflowResponse(void 0)
  }
)
