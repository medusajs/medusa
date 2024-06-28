import {
  FulfillmentDTO,
  OrderWorkflow,
  PaymentCollectionDTO,
  ReturnDTO,
} from "@medusajs/types"
import { MathBN, MedusaError } from "@medusajs/utils"
import {
  WorkflowData,
  createStep,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../common"
import { cancelOrderReturnStep } from "../steps"
import { throwIfReturnIsCancelled } from "../utils/order-validation"

const validateOrder = createStep(
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

    throwIfReturnIsCancelled({ orderReturn })

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

export const cancelOrderWorkflowId = "cancel-order-return"
export const cancelOrderWorkflow = createWorkflow(
  cancelOrderWorkflowId,
  (
    input: WorkflowData<OrderWorkflow.CancelReturnWorkflowInput>
  ): WorkflowData<void> => {
    const orderReturn: ReturnDTO & { fulfillments: FulfillmentDTO[] } =
      useRemoteQueryStep({
        entry_point: "return",
        fields: [
          "id",
          "items.id",
          "items.received_quantity",
          "fulfillments.canceled_at",
        ],
        variables: { id: input.return_id },
        list: false,
        throw_if_key_not_found: true,
      })

    validateOrder({ orderReturn, input })

    cancelOrderReturnStep({ return_id: orderReturn.id })
  }
)
