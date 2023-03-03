import {
  AdminPostOrdersOrderSwapsReq,
  Order,
  ProductVariant,
  ReturnReason,
} from "@medusajs/medusa"
import {
  useAdminCreateSwap,
  useAdminOrder,
  useAdminShippingOptions,
} from "medusa-react"
import React, { useContext, useEffect, useMemo, useState } from "react"
import Spinner from "../../../../components/atoms/spinner"
import Button from "../../../../components/fundamentals/button"
import CheckIcon from "../../../../components/fundamentals/icons/check-icon"
import IconTooltip from "../../../../components/molecules/icon-tooltip"
import Modal from "../../../../components/molecules/modal"
import LayeredModal, {
  LayeredModalContext,
} from "../../../../components/molecules/modal/layered-modal"
import RMAShippingPrice from "../../../../components/molecules/rma-select-shipping"
import Select from "../../../../components/molecules/select"
import RMAReturnProductsTable from "../../../../components/organisms/rma-return-product-table"
import RMASelectProductTable from "../../../../components/organisms/rma-select-product-table"
import useNotification from "../../../../hooks/use-notification"
import { Option } from "../../../../types/shared"
import { getErrorMessage } from "../../../../utils/error-messages"
import { formatAmountWithSymbol } from "../../../../utils/prices"
import RMASelectProductSubModal from "../rma-sub-modals/products"
import { getAllReturnableItems } from "../utils/create-filtering"

type SwapMenuProps = {
  order: Omit<Order, "beforeInsert">
  onDismiss: () => void
}

type ReturnRecord = Record<
  string,
  {
    images: string[]
    note: string
    quantity: number
    reason: {
      label: string
      value: ReturnReason
    } | null
  }
>

type SelectProduct = Omit<ProductVariant & { quantity: number }, "beforeInsert">

const SwapMenu: React.FC<SwapMenuProps> = ({ order, onDismiss }) => {
  const { refetch } = useAdminOrder(order.id)
  const { mutate, isLoading } = useAdminCreateSwap(order.id)
  const layeredModalContext = useContext(LayeredModalContext)
  const [toReturn, setToReturn] = useState<ReturnRecord>({})
  const [useCustomShippingPrice, setUseCustomShippingPrice] = useState(false)

  const [itemsToAdd, setItemsToAdd] = useState<SelectProduct[]>([])
  const [shippingMethod, setShippingMethod] = useState<Option | null>(null)
  const [shippingPrice, setShippingPrice] = useState<number | undefined>(
    undefined
  )
  const [noNotification, setNoNotification] = useState(order.no_notification)

  const notification = useNotification()

  // Includes both order items and swap items
  const allItems = useMemo(() => {
    if (order) {
      return getAllReturnableItems(order, false)
    }
    return []
  }, [order])

  const { shipping_options: shippingOptions, isLoading: shippingLoading } =
    useAdminShippingOptions({
      is_return: true,
      region_id: order.region_id,
    })

  const returnTotal = useMemo(() => {
    const items = Object.keys(toReturn).map((t) =>
      allItems.find((i) => i.id === t)
    )

    return (
      items.reduce((acc, next) => {
        if (!next) {
          return acc
        }

        return (
          acc +
          ((next.refundable || 0) / (next.quantity - next.returned_quantity)) *
            toReturn[next.id].quantity
        )
      }, 0) - (shippingPrice || 0)
    )
  }, [toReturn, shippingPrice])

  const additionalTotal = useMemo(() => {
    return itemsToAdd.reduce((acc, next) => {
      let amount = next.prices.find(
        (ma) => ma.region_id === order.region_id
      )?.amount

      if (!amount) {
        amount = next.prices.find(
          (ma) => ma.currency_code === order.currency_code
        )?.amount
      }

      if (!amount) {
        amount = 0
      }

      const lineTotal = amount * next.quantity
      return acc + lineTotal
    }, 0)
  }, [itemsToAdd])

  const handleToAddQuantity = (value: number, index: number) => {
    const updated = [...itemsToAdd]

    const itemToUpdate = updated[index]

    updated[index] = {
      ...itemToUpdate,
      quantity: itemToUpdate.quantity + value,
    }

    setItemsToAdd(updated)
  }

  const handleRemoveItem = (index: number) => {
    const updated = [...itemsToAdd]
    updated.splice(index, 1)
    setItemsToAdd(updated)
  }

  const handleShippingSelected = (selectedItem: Option) => {
    if (!shippingOptions) {
      return
    }

    setShippingMethod(selectedItem)
    const method = shippingOptions?.find((o) => selectedItem.value === o.id)
    setShippingPrice(method?.amount)
  }

  const handleUpdateShippingPrice = (value: number | undefined) => {
    if (value !== undefined && value >= 0) {
      setShippingPrice(value)
    } else {
      setShippingPrice(0)
    }
  }

  useEffect(() => {
    if (!useCustomShippingPrice && shippingMethod && shippingOptions) {
      const method = shippingOptions.find((o) => shippingMethod.value === o.id)
      setShippingPrice(method?.amount)
    }
  }, [useCustomShippingPrice, shippingMethod])

  const handleProductSelect = (variants: SelectProduct[]) => {
    const existingIds = itemsToAdd.map((i) => i.id)

    setItemsToAdd((itemsToAdd) => [
      ...itemsToAdd,
      ...variants
        .filter((variant) => !existingIds.includes(variant.id))
        .map((variant) => ({ ...variant, quantity: 1 })),
    ])
  }

  const onSubmit = () => {
    const items = Object.entries(toReturn).map(([key, value]) => {
      return {
        item_id: key,
        note: value.note ?? undefined,
        quantity: value.quantity,
        reason_id: value.reason?.value.id ?? undefined,
      }
    })

    const data: AdminPostOrdersOrderSwapsReq = {
      return_items: items,
      additional_items: itemsToAdd.map((i) => ({
        variant_id: i.id,
        quantity: i.quantity,
      })),
      no_notification:
        noNotification !== order.no_notification ? noNotification : undefined,
    }

    if (shippingMethod) {
      data.return_shipping = {
        option_id: shippingMethod.value,
        price: Math.round(shippingPrice || 0),
      }
    }

    return mutate(data, {
      onSuccess: () => {
        refetch()
        notification("Success", "Successfully created exchange", "success")
        onDismiss()
      },
      onError: (err) => {
        notification("Error", getErrorMessage(err), "error")
      },
    })
  }

  return (
    <LayeredModal context={layeredModalContext} handleClose={onDismiss}>
      <Modal.Body>
        <Modal.Header handleClose={onDismiss}>
          <h2 className="inter-xlarge-semibold">Register Exchange</h2>
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
                  })) || []
                }
              />
            )}
            {shippingMethod && (
              <RMAShippingPrice
                inclTax={false}
                useCustomShippingPrice={useCustomShippingPrice}
                shippingPrice={shippingPrice}
                currencyCode={order.currency_code}
                updateShippingPrice={handleUpdateShippingPrice}
                setUseCustomShippingPrice={setUseCustomShippingPrice}
              />
            )}
          </div>
          <div className="flex justify-between mt-8 items-center">
            <h3 className="inter-base-semibold ">Items to send</h3>
            {itemsToAdd.length === 0 ? (
              <Button
                variant="ghost"
                className="border border-grey-20"
                size="small"
                onClick={() => {
                  layeredModalContext.push(
                    SelectProductsScreen(
                      layeredModalContext.pop,
                      itemsToAdd,
                      handleProductSelect
                    )
                  )
                }}
              >
                Add Product
              </Button>
            ) : (
              <></>
            )}
          </div>
          {itemsToAdd.length > 0 && (
            <>
              <RMAReturnProductsTable
                isAdditionalItems
                order={order}
                itemsToAdd={itemsToAdd}
                handleRemoveItem={handleRemoveItem}
                handleToAddQuantity={handleToAddQuantity}
              />

              <div className="flex w-full justify-end">
                <Button
                  variant="ghost"
                  className="border border-grey-20"
                  size="small"
                  onClick={() => {
                    layeredModalContext.push(
                      SelectProductsScreen(
                        layeredModalContext.pop,
                        itemsToAdd,
                        handleProductSelect
                      )
                    )
                  }}
                >
                  Add Product
                </Button>
              </div>
            </>
          )}
          <div className="flex text-grey-90 justify-between items-center inter-small-regular mt-8">
            <span>Return Total</span>
            <span>
              {formatAmountWithSymbol({
                currency: order.currency_code,
                amount: returnTotal,
              })}
            </span>
          </div>
          <div className="flex text-grey-90 justify-between items-center inter-small-regular mt-2">
            <span>Additional Total</span>
            <span>
              {formatAmountWithSymbol({
                currency: order.currency_code,
                amount: additionalTotal,
                digits: 2,
                tax: order.tax_rate ?? undefined,
              })}
            </span>
          </div>
          <div className="flex text-grey-90 justify-between items-center inter-small-regular mt-2">
            <span>Outbond Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="flex justify-between items-center inter-base-semibold mt-4">
            <span>Estimated difference</span>
            <span className="inter-large-semibold">
              {formatAmountWithSymbol({
                currency: order.currency_code,
                amount: additionalTotal - returnTotal,
                digits: 2,
                tax: order.tax_rate ?? undefined,
              })}
            </span>
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="flex w-full justify-between">
            <div
              className="items-center h-full flex cursor-pointer"
              onClick={() => setNoNotification(!noNotification)}
            >
              <div
                className={`w-5 h-5 flex justify-center text-grey-0 border-grey-30 border rounded-base ${
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
                type="checkbox"
              />
              <span className="ml-3 flex items-center text-grey-90 gap-x-xsmall">
                Send notifications
                <IconTooltip content="If unchecked the customer will not receive communication about this exchange" />
              </span>
            </div>

            <Button
              onClick={onSubmit}
              disabled={
                Object.keys(toReturn).length === 0 || itemsToAdd.length === 0
              }
              loading={isLoading}
              type="submit"
              variant="primary"
            >
              Complete
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </LayeredModal>
  )
}

const SelectProductsScreen = (pop, itemsToAdd, setSelectedItems) => {
  return {
    title: "Add Products",
    onBack: () => pop(),
    view: (
      <RMASelectProductSubModal
        selectedItems={itemsToAdd || []}
        onSubmit={setSelectedItems}
      />
    ),
  }
}

export default SwapMenu
