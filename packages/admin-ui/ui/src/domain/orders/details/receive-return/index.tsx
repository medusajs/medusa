import { Order, Return } from "@medusajs/medusa"
import { useAdminOrder, useAdminReceiveReturn } from "medusa-react"
import { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import Button from "../../../../components/fundamentals/button"
import Modal from "../../../../components/molecules/modal"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"
import { nestedForm } from "../../../../utils/nested-form"
import { ItemsToReceiveFormType } from "../../components/items-to-receive-form"
import { ItemsToReceiveForm } from "../../components/items-to-receive-form/items-to-receive-form"
import { RefundAmountFormType } from "../../components/refund-amount-form"
import { ReceiveReturnSummary } from "../../components/rma-summaries/receive-return-summary"
import { getDefaultReceiveReturnValues } from "../utils/get-default-values"
import { orderReturnableFields } from "../utils/order-returnable-fields"
import useOrdersExpandParam from "../utils/use-admin-expand-paramter"

type Props = {
  order: Order
  returnRequest: Return
  onClose: () => void
}

export type ReceiveReturnFormType = {
  receive_items: ItemsToReceiveFormType
  refund_amount: RefundAmountFormType
}

export const ReceiveReturnMenu = ({ order, returnRequest, onClose }: Props) => {
  const { mutate, isLoading } = useAdminReceiveReturn(returnRequest.id)
  const { orderRelations } = useOrdersExpandParam()
  const { refetch } = useAdminOrder(order.id, {
    fields: orderReturnableFields,
    expand: orderRelations,
  })

  /**
   * If the return was refunded as part of a refund claim, we do not allow the user to
   * specify a refund amount, or want to display a summary.
   */
  const isRefundedClaim = useMemo(() => {
    if (returnRequest.claim_order_id) {
      const claim = order.claims.find(
        (c) => c.id === returnRequest.claim_order_id
      )
      if (!claim) {
        return false
      }

      return claim.payment_status === "refunded"
    }

    return false
  }, [order.claims, returnRequest.claim_order_id])

  /**
   * If the return was created as a result of a swap, we do not allow the user to
   * specify a refund amount, or want to display a summary.
   */
  const isSwapOrRefundedClaim = useMemo(() => {
    return isRefundedClaim || Boolean(returnRequest.swap_id)
  }, [isRefundedClaim, returnRequest.swap_id])

  const form = useForm<ReceiveReturnFormType>({
    defaultValues: getDefaultReceiveReturnValues(order, returnRequest),
  })

  const {
    handleSubmit,
    reset,
    setError,
    formState: { isDirty },
  } = form

  const notification = useNotification()

  useEffect(() => {
    reset(getDefaultReceiveReturnValues(order, returnRequest))
  }, [order, returnRequest, reset])

  const onSubmit = handleSubmit((data) => {
    if (data.receive_items.items.filter((it) => it.receive).length === 0) {
      setError("receive_items.items", {
        type: "manual",
        message: "Please select at least one item to receive",
      })

      return
    }

    let refundAmount: number | undefined = undefined

    /**
     * If the return was not refunded as part of a refund claim, or was not created as a
     * result of a swap, we allow the user to specify a refund amount.
     */
    if (data.refund_amount?.amount !== undefined && !isSwapOrRefundedClaim) {
      refundAmount = data.refund_amount.amount
    }

    /**
     * If the return was refunded as part of a refund claim, we set the refund amount to 0.
     * This is a workaround to ensure that the refund is not issued twice.
     */
    if (isRefundedClaim) {
      refundAmount = 0
    }

    mutate(
      {
        items: data.receive_items.items.map((i) => ({
          item_id: i.item_id,
          quantity: i.quantity,
        })),
        refund: refundAmount,
      },
      {
        onSuccess: () => {
          notification(
            "Successfully received return",
            `Received return for order #${order.display_id}`,
            "success"
          )

          // We need to refetch the order to get the updated state
          refetch()

          onClose()
        },
        onError: (error) => {
          notification(
            "Failed to receive return",
            getErrorMessage(error),
            "error"
          )
        },
      }
    )
  })

  return (
    <Modal handleClose={onClose} open={true}>
      <Modal.Body>
        <Modal.Header handleClose={onClose}>
          <h1 className="inter-xlarge-semibold">Receive Return</h1>
        </Modal.Header>
        <form onSubmit={onSubmit}>
          <Modal.Content>
            <div className="flex flex-col gap-y-large">
              <ItemsToReceiveForm
                order={order}
                form={nestedForm(form, "receive_items")}
              />
              {!isSwapOrRefundedClaim && (
                <ReceiveReturnSummary
                  form={form}
                  order={order}
                  returnRequest={returnRequest}
                />
              )}
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex w-full items-center justify-end gap-x-xsmall">
              <Button size="small" variant="secondary">
                Cancel
              </Button>
              <Button
                size="small"
                variant="primary"
                disabled={!isDirty || isLoading}
                loading={isLoading}
              >
                Save and close
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}
