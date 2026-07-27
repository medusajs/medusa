import {
  OrderChangeDTO,
  OrderPreviewDTO,
  OrderWorkflow,
  ReturnDTO,
} from "@medusajs/framework/types"
import { OrderChangeStatus } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createStep,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import { updateReturnsStep } from "../../steps"
import { previewOrderChangeStep } from "../../steps/preview-order-change"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"

/**
 * The data to validate that a return can be updated.
 */
export type UpdateReturnValidationStepInput = {
  /**
   * The order change's details.
   */
  orderChange: OrderChangeDTO
  /**
   * The return's details.
   */
  orderReturn: ReturnDTO
}

/**
 * This step validates that a return can be updated.
 * If the return is canceled or the order change is not active, the step will throw an error.
 * 
 * :::note
 * 
 * You can retrieve a return and order change details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 * 
 * :::
 * 
 * @example
 * const data = updateReturnValidationStep({
 *   orderChange: {
 *     id: "orch_123",
 *     // other order change details...
 *   },
 *   orderReturn: {
 *     id: "return_123",
 *     // other return details...
 *   },
 * })
 */
export const updateReturnValidationStep = createStep(
  "validate-update-return",
  async function ({
    orderChange,
    orderReturn,
  }: UpdateReturnValidationStepInput) {
    throwIfIsCancelled(orderReturn, "Return")
    throwIfOrderChangeIsNotActive({ orderChange })
  }
)

export const updateReturnWorkflowId = "update-return"
/**
 * This workflow updates a return's details. It's used by the
 * [Update Return Admin API Route](https://docs.medusajs.com/api/admin/returns/update-a-return).
 * 
 * You can use this workflow within your customizations or your own custom workflows, allowing you
 * to update a return in your custom flow.
 * 
 * @example
 * const { result } = await updateReturnWorkflow(container)
 * .run({
 *   input: {
 *     return_id: "return_123",
 *     no_notification: true
 *   }
 * })
 * 
 * @summary
 * 
 * Update a return's details.
 */
export const updateReturnWorkflow = createWorkflow(
  updateReturnWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.UpdateReturnWorkflowInput>
  ): WorkflowResponse<OrderPreviewDTO> {
    const orderReturn: ReturnDTO = useRemoteQueryStep({
      entry_point: "return",
      fields: ["id", "status", "order_id", "canceled_at"],
      variables: { id: input.return_id },
      list: false,
      throw_if_key_not_found: true,
    })

    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: ["id", "status", "version", "actions.*"],
      variables: {
        filters: {
          order_id: orderReturn.order_id,
          return_id: orderReturn.id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({ name: "order-change-query" })

    updateReturnValidationStep({ orderReturn, orderChange })

    const updateData = transform({ input }, ({ input }) => {
      return {
        id: input.return_id,
        location_id: input.location_id,
        no_notification: input.no_notification,
        metadata: input.metadata,
      }
    })

    updateReturnsStep([updateData])

    return new WorkflowResponse(previewOrderChangeStep(orderReturn.order_id))
  }
)
