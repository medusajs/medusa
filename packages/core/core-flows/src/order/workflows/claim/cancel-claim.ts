import {
  FulfillmentDTO,
  OrderClaimDTO,
  OrderWorkflow,
} from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"
import {
  WorkflowData,
  createStep,
  createWorkflow,
  parallelize,
  transform,
  when,
} from "@medusajs/framework/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import { deleteReservationsByLineItemsStep } from "../../../reservation/steps/delete-reservations-by-line-items"
import { cancelOrderClaimStep } from "../../steps"
import { throwIfIsCancelled } from "../../utils/order-validation"
import { cancelReturnWorkflow } from "../return/cancel-return"

/**
 * This step validates that a confirmed claim can be canceled.
 */
export const cancelClaimValidateOrderStep = createStep(
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
/**
 * This workflow cancels a confirmed order claim.
 */
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
          "order_id",
          "return_id",
          "canceled_at",
          "fulfillments.canceled_at",
          "additional_items.item_id",
        ],
        variables: { id: input.claim_id },
        list: false,
        throw_if_key_not_found: true,
      })

    cancelClaimValidateOrderStep({ orderClaim, input })

    const lineItemIds = transform({ orderClaim }, ({ orderClaim }) => {
      return orderClaim.additional_items?.map((i) => i.item_id)
    })

    parallelize(
      cancelOrderClaimStep({
        claim_id: orderClaim.id,
        order_id: orderClaim.order_id,
        canceled_by: input.canceled_by,
      }),
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
