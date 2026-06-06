import type { BigNumberInput, OrderDTO } from "@zjedene-medusa/framework/types"
import {
  ChangeActionType,
  OrderChangeStatus,
  OrderChangeType,
} from "@zjedene-medusa/framework/utils"
import {
  createStep,
  createWorkflow,
  transform,
  WorkflowData,
} from "@zjedene-medusa/framework/workflows-sdk"
import { useQueryGraphStep } from "../../../common"
import { confirmOrderChanges } from "../../steps/confirm-order-changes"
import { createOrderChangeStep } from "../../steps/create-order-change"
import { throwIfOrderIsCancelled } from "../../utils/order-validation"
import { createOrderChangeActionsWorkflow } from "../create-order-change-actions"

/**
 * This step validates that an order refund credit line can be issued
 */
export const validateOrderRefundCreditLinesStep = createStep(
  "validate-order-refund-credit-lines",
  async function ({ order }: { order: OrderDTO }) {
    throwIfOrderIsCancelled({ order })
  }
)

export const createOrderRefundCreditLinesWorkflowId =
  "create-order-refund-credit-lines"
/**
 * This workflow creates an order refund credit line
 */
export const createOrderRefundCreditLinesWorkflow = createWorkflow(
  createOrderRefundCreditLinesWorkflowId,
  function (
    input: WorkflowData<{
      order_id: string
      amount: BigNumberInput
      reference?: string
      referenceId?: string
      created_by?: string
    }>
  ) {
    const orderQuery = useQueryGraphStep({
      entity: "orders",
      fields: ["id", "status", "summary", "total", "payment_collections.id"],
      filters: { id: input.order_id },
      options: { throwIfKeyNotFound: true },
    }).config({ name: "get-order" })

    const order = transform(
      { orderQuery },
      ({ orderQuery }) => orderQuery.data[0]
    )

    validateOrderRefundCreditLinesStep({ order })

    const orderChangeInput = transform({ input }, ({ input }) => ({
      change_type: OrderChangeType.CREDIT_LINE,
      order_id: input.order_id,
      created_by: input.created_by,
    }))

    const createdOrderChange = createOrderChangeStep(orderChangeInput)

    const orderChangeActionInput = transform(
      { order, orderChange: createdOrderChange, input },
      ({ order, orderChange, input }) => ({
        order_change_id: orderChange.id,
        order_id: order.id,
        version: orderChange.version,
        action: ChangeActionType.CREDIT_LINE_ADD,
        reference: input.reference ?? "payment_collection",
        reference_id: input.referenceId ?? order.payment_collections[0]?.id,
        amount: input.amount,
      })
    )

    createOrderChangeActionsWorkflow.runAsStep({
      input: [orderChangeActionInput],
    })

    const orderChangeQuery = useQueryGraphStep({
      entity: "order_change",
      fields: [
        "id",
        "status",
        "change_type",
        "actions.id",
        "actions.order_id",
        "actions.action",
        "actions.details",
        "actions.reference",
        "actions.reference_id",
        "actions.internal_note",
      ],
      filters: {
        order_id: input.order_id,
        status: [OrderChangeStatus.PENDING],
      },
    }).config({ name: "order-change-query" })

    const orderChange = transform(
      { orderChangeQuery },
      ({ orderChangeQuery }) => orderChangeQuery.data[0]
    )

    confirmOrderChanges({
      changes: [orderChange],
      orderId: order.id,
    })
  }
)
