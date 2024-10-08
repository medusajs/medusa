import {
  FulfillmentDTO,
  OrderWorkflow,
  PaymentCollectionDTO,
  ReturnDTO,
} from "@medusajs/framework/types"
import { MathBN, MedusaError } from "@medusajs/framework/utils"
import {
  WorkflowData,
  createStep,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import { cancelOrderReturnStep } from "../../steps"
import { throwIfIsCancelled } from "../../utils/order-validation"

/**
 * This step validates that a return can be canceled.
 */
export const cancelReturnValidateOrder = createStep(
  "validate-return",
  ({
    orderReturn,
  }: {
    orderReturn: ReturnDTO
    input: OrderWorkflow.CancelReturnWorkflowInput
  }) => {
    const orderReturn_ = orderReturn as ReturnDTO & {
      payment_collections: PaymentCollectionDTO[]
      fulfillments: FulfillmentDTO[]
    }

    throwIfIsCancelled(orderReturn, "Return")

    const throwErrorIf = (
      arr: unknown[],
      pred: (obj: any) => boolean,
      message: string
    ) => {
      if (arr?.some(pred)) {
        throw new MedusaError(MedusaError.Types.NOT_ALLOWED, message)
      }
    }

    const notCanceled = (o) => !o.canceled_at
    const hasReceived = (o) => MathBN.gt(o.received_quantity, 0)

    throwErrorIf(
      orderReturn_.fulfillments,
      notCanceled,
      "All fulfillments must be canceled before canceling a return"
    )

    throwErrorIf(
      orderReturn_.items!,
      hasReceived,
      "Can't cancel a return which has returned items"
    )
  }
)

export const cancelReturnWorkflowId = "cancel-return"
/**
 * This workflow cancels a return.
 */
export const cancelReturnWorkflow = createWorkflow(
  cancelReturnWorkflowId,
  (
    input: WorkflowData<OrderWorkflow.CancelReturnWorkflowInput>
  ): WorkflowData<void> => {
    const orderReturn: ReturnDTO & { fulfillments: FulfillmentDTO[] } =
      useRemoteQueryStep({
        entry_point: "return",
        fields: [
          "id",
          "order_id",
          "canceled_at",
          "items.id",
          "items.received_quantity",
          "fulfillments.canceled_at",
        ],
        variables: { id: input.return_id },
        list: false,
        throw_if_key_not_found: true,
      })

    cancelReturnValidateOrder({ orderReturn, input })

    cancelOrderReturnStep({
      return_id: orderReturn.id,
      order_id: orderReturn.order_id,
      canceled_by: input.canceled_by,
    })
  }
)
