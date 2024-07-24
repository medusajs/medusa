import { OrderChangeDTO, OrderClaimDTO, OrderDTO } from "@medusajs/types"
import { ChangeActionType, OrderChangeStatus } from "@medusajs/utils"
import {
  WorkflowData,
  createStep,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import {
  deleteClaimsStep,
  deleteOrderChangesStep,
  deleteOrderShippingMethods,
  deleteReturnsStep,
} from "../../steps"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"

type WorkflowInput = {
  claim_id: string
}

const validationStep = createStep(
  "validate-cancel-begin-order-claim",
  async function ({
    order,
    orderChange,
    orderClaim,
  }: {
    order: OrderDTO
    orderClaim: OrderClaimDTO
    orderChange: OrderChangeDTO
  }) {
    throwIfIsCancelled(order, "Order")
    throwIfIsCancelled(orderClaim, "Claim")
    throwIfOrderChangeIsNotActive({ orderChange })
  }
)

export const cancelBeginOrderClaimWorkflowId = "cancel-begin-order-claim"
export const cancelBeginOrderClaimWorkflow = createWorkflow(
  cancelBeginOrderClaimWorkflowId,
  function (input: WorkflowInput): WorkflowData<void> {
    const orderClaim: OrderClaimDTO = useRemoteQueryStep({
      entry_point: "claim",
      fields: ["id", "status", "order_id", "return_id", "canceled_at"],
      variables: { id: input.claim_id },
      list: false,
      throw_if_key_not_found: true,
    })

    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["id", "version", "canceled_at"],
      variables: { id: orderClaim.order_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-query" })

    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: ["id", "status", "version", "actions.*"],
      variables: {
        filters: {
          order_id: orderClaim.order_id,
          claim_id: orderClaim.id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({ name: "order-change-query" })

    validationStep({ order, orderClaim, orderChange })

    const shippingToRemove = transform(
      { orderChange, input },
      ({ orderChange, input }) => {
        return (orderChange.actions ?? [])
          .filter((a) => a.action === ChangeActionType.SHIPPING_ADD)
          .map(({ id }) => id)
      }
    )

    parallelize(
      deleteReturnsStep({ ids: [orderClaim.return_id!] }),
      deleteClaimsStep({ ids: [orderClaim.id] }),
      deleteOrderChangesStep({ ids: [orderChange.id] }),
      deleteOrderShippingMethods({ ids: shippingToRemove })
    )
  }
)
