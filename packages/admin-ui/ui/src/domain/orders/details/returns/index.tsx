import { LineItem as RawLineItem, Order } from "@medusajs/medusa"
import { useAdminRequestReturn, useAdminShippingOptions } from "medusa-react"
import React, { useContext, useEffect, useState } from "react"
import Spinner from "../../../../components/atoms/spinner"
import Button from "../../../../components/fundamentals/button"
import CheckIcon from "../../../../components/fundamentals/icons/check-icon"
import EditIcon from "../../../../components/fundamentals/icons/edit-icon"
import IconTooltip from "../../../../components/molecules/icon-tooltip"
import Modal from "../../../../components/molecules/modal"
import LayeredModal, {
  LayeredModalContext,
} from "../../../../components/molecules/modal/layered-modal"
import RMAShippingPrice from "../../../../components/molecules/rma-select-shipping"
import Select from "../../../../components/molecules/select"
import CurrencyInput from "../../../../components/organisms/currency-input"
import RMASelectProductTable from "../../../../components/organisms/rma-select-product-table"
import useNotification from "../../../../hooks/use-notification"
import { Option } from "../../../../types/shared"
import { getErrorMessage } from "../../../../utils/error-messages"
import { displayAmount } from "../../../../utils/prices"
import { removeNullish } from "../../../../utils/remove-nullish"
import { getAllReturnableItems } from "../utils/create-filtering"

type ReturnMenuProps = {
  order: Order
  onDismiss: () => void
}

type LineItem = Omit<RawLineItem, "beforeInsert">

const ReturnMenu: React.FC<ReturnMenuProps> = ({ order, onDismiss }) => {
  const layoutmodalcontext = useContext(LayeredModalContext)

  const [submitting, setSubmitting] = useState(false)
  const [refundEdited, setRefundEdited] = useState(false)
  const [refundable, setRefundable] = useState(0)
  const [refundAmount, setRefundAmount] = useState(0)
  const [toReturn, setToReturn] = useState<
    Record<string, { quantity: number }>
  >({})
  const [useCustomShippingPrice, setUseCustomShippingPrice] = useState(false)

  const [noNotification, setNoNotification] = useState(order.no_notification)
  const [shippingPrice, setShippingPrice] = useState<number>()
  const [shippingMethod, setShippingMethod] = useState<Option | null>(null)

  const [allItems, setAllItems] = useState<Omit<LineItem, "beforeInsert">[]>([])

  const notification = useNotification()

  const requestReturnOrder = useAdminRequestReturn(order.id)

  useEffect(() => {
    if (order) {
      setAllItems(getAllReturnableItems(order, false))
    }
  }, [order])

  const { isLoading: shippingLoading, shipping_options: shippingOptions } =
    useAdminShippingOptions({
      region_id: order.region_id,
      is_return: true,
    })

  useEffect(() => {
    const items = Object.keys(toReturn)
      .map((t) => allItems.find((i) => i.id === t))
      .filter((i) => typeof i !== "undefined") as LineItem[]

    const itemTotal = items.reduce((acc: number, curr: LineItem): number => {
      const unitRefundable =
        (curr.refundable || 0) / (curr.quantity - curr.returned_quantity)

      return acc + unitRefundable * toReturn[curr.id].quantity
    }, 0)

    const total = itemTotal - (shippingPrice || 0)

    setRefundable(total)

    setRefundAmount(total)
  }, [toReturn, shippingPrice])

  const onSubmit = async () => {
    const items = Object.entries(toReturn).map(([key, value]) => {
      const toSet = {
        reason_id: value.reason?.value.id,
        ...value,
      }
      delete toSet.reason
      const clean = removeNullish(toSet)
      return {
        item_id: key,
        ...clean,
      }
    })

    const data = {
      items,
      refund: Math.round(refundAmount),
      no_notification:
        noNotification !== order.no_notification ? noNotification : undefined,
    }

    if (shippingMethod) {
      const taxRate = shippingMethod.tax_rates.reduce((acc, curr) => {
        return acc + curr.rate / 100
      }, 0)

      data.return_shipping = {
        option_id: shippingMethod.value,
        price: shippingPrice ? Math.round(shippingPrice / (1 + taxRate)) : 0,
      }
    }

    setSubmitting(true)
    return requestReturnOrder
      .mutateAsync(data)
      .then(() => onDismiss())
      .then(() =>
        notification("Success", "Successfully returned order", "success")
      )
      .catch((error) => notification("Error", getErrorMessage(error), "error"))
      .finally(() => setSubmitting(false))
  }

  const handleRefundUpdated = (value) => {
    if (value < order.refundable_amount && value >= 0) {
      setRefundAmount(value)
    }
  }

  const handleShippingSelected = (selectedItem) => {
    setShippingMethod(selectedItem)
    const method = shippingOptions?.find((o) => selectedItem.value === o.id)

    if (method) {
      setShippingPrice(method.price_incl_tax)
    }
  }

  useEffect(() => {
    if (!useCustomShippingPrice && shippingMethod) {
      const method = shippingOptions?.find((o) => shippingMethod.value === o.id)

      if (method) {
        setShippingPrice(method.price_incl_tax)
      }
    }
  }, [useCustomShippingPrice, shippingMethod])

  const handleUpdateShippingPrice = (value) => {
    if (value >= 0) {
      setShippingPrice(value)
    }
  }

  return (
    <LayeredModal context={layoutmodalcontext} handleClose={onDismiss}>
      <Modal.Body>
        <Modal.Header handleClose={onDismiss}>
          <h2 className="inter-xlarge-semibold">Request Return</h2>
        </Modal.Header>
        <Modal.Content>
          <div className="mb-7">
            <h3 className="inter-base-semibold">Items to return</h3>
            <RMASelectProductTable
              order={order}
              allItems={allItems}
              toReturn={toReturn}
              setToReturn={(items) => setToReturn(items)}
            />
          </div>

          <div>
            <h3 className="inter-base-semibold ">Shipping</h3>
            {shippingLoading ? (
              <div className="flex justify-center">
                <Spinner size="medium" variant="secondary" />
              </div>
            ) : (
              <Select
                label="Shipping Method"
                className="mt-2"
                placeholder="Add a shipping method"
                value={shippingMethod}
                onChange={handleShippingSelected}
                options={
                  shippingOptions?.map((o) => ({
                    label: o.name,
                    value: o.id,
                    tax_rates: o.tax_rates,
                  })) || []
                }
              />
            )}
            {shippingMethod && (
              <RMAShippingPrice
                inclTax
                useCustomShippingPrice={useCustomShippingPrice}
                shippingPrice={shippingPrice}
                currencyCode={order.currency_code}
                updateShippingPrice={handleUpdateShippingPrice}
                setUseCustomShippingPrice={setUseCustomShippingPrice}
              />
            )}
          </div>

          {refundable >= 0 && (
            <div className="mt-10">
              {!useCustomShippingPrice && shippingMethod && (
                <div className="inter-small-regular mb-4 flex justify-between">
                  <span>Shipping</span>
                  <div>
                    {displayAmount(order.currency_code, shippingPrice || 0)}{" "}
                    <span className="ml-3 text-grey-40">
                      {order.currency_code.toUpperCase()}
                    </span>
                  </div>
                </div>
              )}
              <div className="inter-base-semibold flex w-full justify-between">
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
        </Modal.Content>
        <Modal.Footer>
          <div className="flex w-full justify-between">
            <div
              className="flex h-full cursor-pointer items-center"
              onClick={() => setNoNotification(!noNotification)}
            >
              <div
                className={`flex h-5 w-5 justify-center rounded-base border border-grey-30 text-grey-0 ${
                  !noNotification && "bg-violet-60"
                }`}
              >
                <span className="self-center">
                  {!noNotification && <CheckIcon size={16} />}
                </span>
              </div>
              <input
                id="noNotification"
                className="hidden"
                name="noNotification"
                checked={!noNotification}
                onChange={() => setNoNotification(!noNotification)}
                type="checkbox"
              />
              <span className="ml-3 flex items-center gap-x-xsmall text-grey-90">
                Send notifications
                <IconTooltip content="Notify customer of created return" />
              </span>
            </div>
            <div className="flex gap-x-xsmall">
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
                type="submit"
                size="small"
                variant="primary"
                disabled={Object.keys(toReturn).length === 0}
              >
                Submit
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </LayeredModal>
  )
}

export default ReturnMenu
