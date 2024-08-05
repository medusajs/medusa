import { FulfillmentDTO, OrderClaimDTO, OrderWorkflow } from "@medusajs/types"
import { MedusaError } from "@medusajs/utils"
import {
  WorkflowData,
  createStep,
  createWorkflow,
  parallelize,
  transform,
  when,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import { deleteReservationsByLineItemsStep } from "../../../reservation/steps/delete-reservations-by-line-items"
import { cancelOrderClaimStep } from "../../steps"
import { throwIfIsCancelled } from "../../utils/order-validation"
import { cancelReturnWorkflow } from "../return/cancel-return"

const validateOrder = createStep(
  "validate-claim",
  ({
    orderClaim,
  }: {
    orderClaim: OrderClaimDTO
    input: OrderWorkflow.CancelOrderClaimWorkflowInput
  }) => {
    const orderClaim_ = orderClaim as OrderClaimDTO & {
      fulfillments: FulfillmentDTO[]
    }

    throwIfIsCancelled(orderClaim, "Claim")

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

    throwErrorIf(
      orderClaim_.fulfillments,
      notCanceled,
      "All fulfillments must be canceled before canceling a claim"
    )
  }
)

export const cancelOrderClaimWorkflowId = "cancel-claim"
export const cancelOrderClaimWorkflow = createWorkflow(
  cancelOrderClaimWorkflowId,
  (
    input: WorkflowData<OrderWorkflow.CancelOrderClaimWorkflowInput>
  ): WorkflowData<void> => {
    const orderClaim: OrderClaimDTO & { fulfillments: FulfillmentDTO[] } =
      useRemoteQueryStep({
        entry_point: "order_claim",
        fields: [
          "id",
          "return_id",
          "canceled_at",
          "fulfillments.canceled_at",
          "additional_items.item_id",
        ],
        variables: { id: input.claim_id },
        list: false,
        throw_if_key_not_found: true,
      })

    validateOrder({ orderClaim, input })

    const lineItemIds = transform({ orderClaim }, ({ orderClaim }) => {
      return orderClaim.additional_items?.map((i) => i.item_id)
    })

    parallelize(
      cancelOrderClaimStep({ claim_id: orderClaim.id }),
      deleteReservationsByLineItemsStep(lineItemIds)
    )

    when({ orderClaim }, ({ orderClaim }) => {
      return !!orderClaim.return_id
    }).then(() => {
      cancelReturnWorkflow.runAsStep({
        input: {
          return_id: orderClaim.return_id!,
          no_notification: input.no_notification,
        },
      })
    })
  }
)
