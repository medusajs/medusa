import {
  OrderChangeDTO,
  OrderClaimDTO,
  OrderDTO,
  OrderWorkflow,
  ReturnDTO,
} from "@medusajs/types"
import { ChangeActionType, OrderChangeStatus } from "@medusajs/utils"
import {
  WorkflowData,
  createStep,
  createWorkflow,
  transform,
  when,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import { createOrderChangeActionsStep } from "../../steps/create-order-change-actions"
import { createReturnsStep } from "../../steps/create-returns"
import { previewOrderChangeStep } from "../../steps/preview-order-change"
import { updateOrderClaimsStep } from "../../steps/update-order-claims"
import {
  throwIfIsCancelled,
  throwIfItemsDoesNotExistsInOrder,
  throwIfOrderChangeIsNotActive,
  throwIfOrderIsCancelled,
} from "../../utils/order-validation"

const validationStep = createStep(
  "claim-request-item-return-validation",
  async function ({
    order,
    orderChange,
    orderReturn,
    orderClaim,
    items,
  }: {
    order: OrderDTO
    orderReturn: ReturnDTO
    orderClaim: OrderClaimDTO
    orderChange: OrderChangeDTO
    items: OrderWorkflow.OrderClaimRequestItemReturnWorkflowInput["items"]
  }) {
    throwIfOrderIsCancelled({ order })
    throwIfIsCancelled(orderClaim, "Claim")
    throwIfIsCancelled(orderReturn, "Return")
    throwIfOrderChangeIsNotActive({ orderChange })
    throwIfItemsDoesNotExistsInOrder({ order, inputItems: items })
  }
)

export const orderClaimRequestItemReturnWorkflowId = "claim-request-item-return"
export const orderClaimRequestItemReturnWorkflow = createWorkflow(
  orderClaimRequestItemReturnWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.OrderClaimRequestItemReturnWorkflowInput>
  ): WorkflowData<OrderDTO> {
    const orderClaim = useRemoteQueryStep({
      entry_point: "order_claim",
      fields: ["id", "order_id", "return_id"],
      variables: { id: input.claim_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "claim-query" })

    const existingOrderReturn = when({ orderClaim }, ({ orderClaim }) => {
      return orderClaim.return_id
    }).then(() => {
      return useRemoteQueryStep({
        entry_point: "return",
        fields: ["id", "status", "order_id"],
        variables: { id: orderClaim.return_id },
        list: false,
        throw_if_key_not_found: true,
      }).config({ name: "return-query" }) as ReturnDTO
    })

    const createdReturn = when({ orderClaim }, ({ orderClaim }) => {
      return !orderClaim.return_id
    }).then(() => {
      return createReturnsStep([
        {
          order_id: orderClaim.order_id,
          claim_id: orderClaim.id,
        },
      ])
    })

    const orderReturn: ReturnDTO = transform(
      { createdReturn, existingOrderReturn, orderClaim },
      ({ createdReturn, existingOrderReturn, orderClaim }) => {
        return existingOrderReturn ?? (createdReturn[0] as ReturnDTO)
      }
    )

    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["id", "status", "items.*"],
      variables: { id: orderClaim.order_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-query" })

    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: ["id", "status"],
      variables: {
        filters: {
          order_id: orderClaim.order_id,
          claim_id: orderClaim.id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({
      name: "order-change-query",
      status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
    })

    validationStep({
      order,
      items: input.items,
      orderClaim,
      orderReturn,
      orderChange,
    })

    when({ orderClaim }, ({ orderClaim }) => {
      return !orderClaim.return_id
    }).then(() => {
      const createdReturnId = transform(
        { createdReturn },
        ({ createdReturn }) => {
          return createdReturn[0]!.id
        }
      )
      updateOrderClaimsStep([
        {
          id: orderClaim.id,
          return_id: createdReturnId,
        },
      ])
    })

    const orderChangeActionInput = transform(
      { order, orderChange, orderClaim, orderReturn, items: input.items },
      ({ order, orderChange, orderClaim, orderReturn, items }) => {
        return items.map((item) => ({
          order_change_id: orderChange.id,
          order_id: order.id,
          claim_id: orderClaim.id,
          return_id: orderReturn.id,
          version: orderChange.version,
          action: ChangeActionType.RETURN_ITEM,
          internal_note: item.internal_note,
          reference: "return",
          reference_id: orderReturn.id,
          details: {
            reference_id: item.id,
            quantity: item.quantity,
            metadata: item.metadata,
          },
        }))
      }
    )

    createOrderChangeActionsStep(orderChangeActionInput)

    return previewOrderChangeStep(orderClaim.order_id)
  }
)
