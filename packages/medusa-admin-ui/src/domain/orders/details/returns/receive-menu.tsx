import {
  LineItem as RawLineItem,
  Order,
  Return,
  ReturnItem,
} from "@medusajs/medusa"
import React, { useEffect, useMemo, useState } from "react"
import Button from "../../../../components/fundamentals/button"
import EditIcon from "../../../../components/fundamentals/icons/edit-icon"
import Modal from "../../../../components/molecules/modal"
import CurrencyInput from "../../../../components/organisms/currency-input"
import RMASelectReturnProductTable from "../../../../components/organisms/rma-select-receive-product-table"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"
import { displayAmount } from "../../../../utils/prices"

type Item = {
  item_id: string
  quantity: number
}

type ReceiveMenuProps = {
  order: Omit<Order, "beforeInsert">
  returnRequest: Omit<Return, "beforeInsert">
  onDismiss: () => void
  onReceiveSwap?: (items: Item[]) => Promise<void>
  onReceiveReturn?: (items: Item[], refund?: number) => Promise<void>
  refunded?: boolean
}

type LineItem = Omit<RawLineItem, "beforeInsert">

const ReceiveMenu: React.FC<ReceiveMenuProps> = ({
  order,
  returnRequest,
  onReceiveReturn,
  onReceiveSwap,
  onDismiss,
  refunded,
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [refundEdited, setRefundEdited] = useState(false)
  const [refundAmount, setRefundAmount] = useState(0)
  const [toReturn, setToReturn] = useState<
    Record<string, { quantity: number }>
  >({})

  const notification = useNotification()

  const allItems: Omit<LineItem, "beforeInsert">[] = useMemo(() => {
    const idLookUp = returnRequest.items.map((i) => i.item_id)

    let allItems = [...order.items]

    if (order.swaps && order.swaps.length) {
      for (const swap of order.swaps) {
        allItems = [...allItems, ...swap.additional_items]
      }
    }

    if (order.claims && order.claims.length) {
      for (const claim of order.claims) {
        allItems = [...allItems, ...claim.additional_items]
      }
    }

    const withAdjustedQuantity = allItems.filter((i) => idLookUp.includes(i.id))

    return withAdjustedQuantity
  }, [order, returnRequest])

  useEffect(() => {
    const returns = {}

    returnRequest.items.forEach((i: ReturnItem) => {
      const item = allItems.find((l) => l.id === i.item_id)
      if (item && item.quantity - item.returned_quantity > 0) {
        returns[i.item_id] = {
          ...item,
          quantity: returnRequest.items.find((i) => i.item_id === item.id)
            ?.quantity,
        }
      }
    })

    setToReturn(returns)
  }, [allItems])

  const shippingTaxRate = useMemo(() => {
    return returnRequest.shipping_method.tax_lines.reduce((acc, curr) => {
      return acc + curr.rate
    }, 0)
  }, [returnRequest])

  useEffect(() => {
    if (!Object.entries(toReturn).length) {
      setRefundAmount(0)
      return
    }

    const items = Object.keys(toReturn)
      .map((t) => ({
        ...allItems.find((i) => i.id === t),
      }))
      .filter((i) => typeof i !== "undefined") as LineItem[]

    const itemTotal = items.reduce((acc: number, curr: LineItem): number => {
      const unitRefundable =
        (curr.refundable || 0) / (curr.quantity - curr.returned_quantity)

      return acc + unitRefundable * toReturn[curr.id].quantity
    }, 0)

    const shippingTotal =
      (returnRequest.shipping_method &&
        returnRequest.shipping_method.price * (1 + shippingTaxRate / 100)) ||
      0

    const total = itemTotal - shippingTotal

    if (!refundEdited || total < refundAmount) {
      setRefundAmount(refundAmount < 0 ? 0 : total)
    }
  }, [toReturn, shippingTaxRate])

  const onSubmit = () => {
    const items = Object.keys(toReturn).map((k) => ({
      item_id: k,
      quantity: toReturn[k].quantity,
    }))

    if (returnRequest.swap_id && onReceiveSwap) {
      setSubmitting(true)
      return onReceiveSwap(items)
        .then(() => onDismiss())
        .then(() =>
          notification("Success", "Successfully received return", "success")
        )
        .catch((error) =>
          notification("Error", getErrorMessage(error), "error")
        )
        .finally(() => setSubmitting(false))
    }

    if (!returnRequest.swap_id && onReceiveReturn) {
      setSubmitting(true)
      return onReceiveReturn(items, Math.round(refundAmount))
        .then(() => onDismiss())
        .then(() =>
          notification("Success", "Successfully returned order", "success")
        )
        .catch((error) =>
          notification("Error", getErrorMessage(error), "error")
        )
        .finally(() => setSubmitting(false))
    }
  }

  const handleRefundUpdated = (value: number | undefined) => {
    if (!value) {
      return
    }

    if (value < order.refundable_amount && value >= 0) {
      setRefundEdited(true)
      setRefundAmount(value)
    }
  }

  return (
    <Modal handleClose={onDismiss}>
      <Modal.Body>
        <Modal.Header handleClose={onDismiss}>
          <h2 className="inter-xlarge-semibold">Receive Return</h2>
        </Modal.Header>
        <Modal.Content>
          <h3 className="inter-base-semibold">Items to receive</h3>
          <RMASelectReturnProductTable
            order={order}
            allItems={allItems}
            toReturn={toReturn}
            setToReturn={(items) => setToReturn(items)}
          />

          {!returnRequest.swap_id && (
            <>
              {returnRequest.shipping_method &&
                returnRequest.shipping_method.price !== undefined && (
                  <div className="my-4 flex justify-between">
                    <span className="inter-base-semibold">Shipping cost</span>
                    <span>
                      {(
                        (returnRequest.shipping_method.price / 100) *
                        (1 + shippingTaxRate / 100)
                      ).toFixed(2)}{" "}
                      <span className="text-grey-50">
                        {order.currency_code.toUpperCase()}
                      </span>
                    </span>
                  </div>
                )}
              {!refunded && (
                <div>
                  <div className="flex inter-base-semibold justify-between w-full">
                    <span>Total Refund</span>
                    <div className="flex items-center">
                      {!refundEdited && (
                        <>
                          <span
                            className="mr-2 cursor-pointer text-grey-40"
                            onClick={() => setRefundEdited(true)}
                          >
                            <EditIcon size={20} />{" "}
                          </span>
                          {`${displayAmount(
                            order.currency_code,
                            refundAmount
                          )} ${order.currency_code.toUpperCase()}`}
                        </>
                      )}
                    </div>
                  </div>
                  {refundEdited && (
                    <CurrencyInput.Root
                      className="mt-2"
                      size="small"
                      currentCurrency={order.currency_code}
                      readOnly
                    >
                      <CurrencyInput.Amount
                        label={"Amount"}
                        amount={refundAmount}
                        onChange={handleRefundUpdated}
                      />
                    </CurrencyInput.Root>
                  )}
                </div>
              )}
            </>
          )}
        </Modal.Content>
        <Modal.Footer>
          <div className="flex w-full justify-end gap-x-xsmall">
            <Button
              onClick={() => onDismiss()}
              className="w-[112px]"
              type="submit"
              size="small"
              variant="ghost"
            >
              Back
            </Button>
            <Button
              onClick={onSubmit}
              loading={submitting}
              className="w-[112px]"
              variant="primary"
              size="small"
            >
              Complete
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default ReceiveMenu
