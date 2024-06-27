import {
  FulfillmentDTO,
  OrderWorkflow,
  PaymentCollectionDTO,
  ReturnDTO,
} from "@medusajs/types"
import { MedusaError, deepFlatMap } from "@medusajs/utils"
import {
  WorkflowData,
  createStep,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../common"
import { cancelPaymentStep } from "../../payment/steps"
import { deleteReservationsByLineItemsStep } from "../../reservation/steps"
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

    let refunds = 0
    let captures = 0

    deepFlatMap(
      orderReturn_,
      "payment_collections.payments",
      ({ payments }) => {
        refunds += payments?.refunds?.length ?? 0
        captures += payments?.captures?.length ?? 0
      }
    )

    if (captures > 0) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Order with payment capture(s) cannot be canceled"
      )
    }

    if (refunds > 0) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Order with payment refund(s) cannot be canceled"
      )
    }

    const throwErrorIf = (
      arr: unknown[],
      pred: (obj: any) => boolean,
      type: string
    ) => {
      if (arr?.filter(pred).length) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          `All ${type} must be canceled before canceling an orderReturn`
        )
      }
    }

    const notCanceled = (o) => !o.canceled_at

    throwErrorIf(orderReturn_.fulfillments, notCanceled, "fulfillments")
  }
)

export const cancelOrderWorkflowId = "cancel-orderReturn"
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
          "fulfillments.canceled_at",
          "payment_collections.payments.id",
          "payment_collections.payments.refunds.id",
          "payment_collections.payments.captures.id",
        ],
        variables: { id: input.orderReturn_id },
        list: false,
        throw_if_key_not_found: true,
      })

    validateOrder({ orderReturn, input })

    const lineItemIds = transform({ orderReturn }, ({ orderReturn }) => {
      return orderReturn.items?.map((i) => i.id)
    })

    const paymentIds = transform({ orderReturn }, ({ orderReturn }) => {
      return deepFlatMap(
        orderReturn,
        "payment_collections.payments",
        ({ payments }) => {
          return payments?.id
        }
      )
    })

    parallelize(
      deleteReservationsByLineItemsStep(lineItemIds),
      cancelPaymentStep({ paymentIds }),
      cancelOrderReturnStep({ returnIds: [orderReturn.id] })
    )
  }
)
