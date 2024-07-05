import {
  AdminGetVariantsVariantInventoryRes,
  AdminPostOrdersOrderReturnsReq,
  LevelWithAvailability,
  Order,
  LineItem as RawLineItem,
} from "@medusajs/medusa"
import LayeredModal, {
  LayeredModalContext,
} from "../../../../components/molecules/modal/layered-modal"
import React, { useContext, useEffect, useState } from "react"
import {
  useAdminRequestReturn,
  useAdminShippingOptions,
  useAdminStockLocations,
  useMedusa,
} from "medusa-react"
import { useTranslation } from "react-i18next"

import Button from "../../../../components/fundamentals/button"
import CheckIcon from "../../../../components/fundamentals/icons/check-icon"
import CurrencyInput from "../../../../components/organisms/currency-input"
import EditIcon from "../../../../components/fundamentals/icons/edit-icon"
import IconTooltip from "../../../../components/molecules/icon-tooltip"
import Modal from "../../../../components/molecules/modal"
import { Option } from "../../../../types/shared"
import RMASelectProductTable from "../../../../components/organisms/rma-select-product-table"
import RMAShippingPrice from "../../../../components/molecules/rma-select-shipping"
import Select from "../../../../components/molecules/select/next-select/select"
import Spinner from "../../../../components/atoms/spinner"
import WarningCircleIcon from "../../../../components/fundamentals/icons/warning-circle"
import { displayAmount } from "../../../../utils/prices"
import { getAllReturnableItems } from "../utils/create-filtering"
import { getErrorMessage } from "../../../../utils/error-messages"
import { removeFalsy } from "../../../../utils/remove-nullish"
import { useFeatureFlag } from "../../../../providers/feature-flag-provider"
import useNotification from "../../../../hooks/use-notification"

type ReturnMenuProps = {
  order: Order
  onDismiss: () => void
}

type LineItem = Omit<RawLineItem, "beforeInsert">

const ReturnMenu: React.FC<ReturnMenuProps> = ({ order, onDismiss }) => {
  const { client } = useMedusa()
  const { t } = useTranslation()
  const layeredModalContext = useContext(LayeredModalContext)
  const { isFeatureEnabled } = useFeatureFlag()
  const isLocationFulfillmentEnabled =
    isFeatureEnabled("inventoryService") &&
    isFeatureEnabled("stockLocationService")

  const [submitting, setSubmitting] = useState(false)
  const [refundEdited, setRefundEdited] = useState(false)
  const [refundable, setRefundable] = useState(0)
  const [refundAmount, setRefundAmount] = useState(0)
  const [selectedLocation, setSelectedLocation] = useState<{
    value: string
    label: string
  } | null>(null)
  const [toReturn, setToReturn] = useState<
    Record<string, { quantity: number }>
  >({})
  const [useCustomShippingPrice, setUseCustomShippingPrice] = useState(false)

  const [noNotification, setNoNotification] = useState(order.no_notification)
  const [shippingPrice, setShippingPrice] = useState<number>()
  const [shippingMethod, setShippingMethod] = useState<Option | null>(null)

  const [allItems, setAllItems] = useState<Omit<LineItem, "beforeInsert">[]>([])

  const notification = useNotification()

  const { stock_locations, refetch } = useAdminStockLocations(
    {},
    {
      enabled: isLocationFulfillmentEnabled,
    }
  )

  React.useEffect(() => {
    if (isLocationFulfillmentEnabled) {
      refetch()
    }
  }, [isLocationFulfillmentEnabled, refetch])

  const requestReturnOrder = useAdminRequestReturn(order.id)

  useEffect(() => {
    if (order) {
      setAllItems(getAllReturnableItems(order, false))
    }
  }, [order])

  const itemMap = React.useMemo(() => {
    return new Map<string, LineItem>(order.items.map((i) => [i.id, i]))
  }, [order.items])

  const [inventoryMap, setInventoryMap] = useState<
    Map<string, LevelWithAvailability[]>
  >(new Map())

  React.useEffect(() => {
    const getInventoryMap = async () => {
      if (!allItems.length || !isLocationFulfillmentEnabled) {
        return new Map()
      }
      const itemInventoryList = await Promise.all(
        allItems.map(async (item) => {
          if (!item.variant_id) {
            return undefined
          }
          return await client.admin.variants.getInventory(item.variant_id)
        })
      )

      return new Map(
        itemInventoryList
          .filter((it) => !!it)
          .map((item) => {
            const { variant } = item as AdminGetVariantsVariantInventoryRes
            return [variant.id, variant.inventory[0]?.location_levels]
          })
      )
    }

    getInventoryMap().then((map) => {
      setInventoryMap(map)
    })
  }, [allItems, client.admin.variants, isLocationFulfillmentEnabled])

  const locationsHasInventoryLevels = React.useMemo(() => {
    return Object.entries(toReturn)
      .map(([itemId]) => {
        const item = itemMap.get(itemId)
        if (!item?.variant_id) {
          return true
        }
        const hasInventoryLevel = inventoryMap
          .get(item.variant_id)
          ?.find((l) => l.location_id === selectedLocation?.value)

        if (!hasInventoryLevel && selectedLocation?.value) {
          return false
        }
        return true
      })
      .every(Boolean)
  }, [toReturn, itemMap, selectedLocation?.value, inventoryMap])

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
      const clean = removeFalsy(toSet)
      return {
        item_id: key,
        ...(clean as { quantity: number }),
      }
    })

    const data: AdminPostOrdersOrderReturnsReq = {
      items,
      refund: Math.round(refundAmount),
      no_notification:
        noNotification !== order.no_notification ? noNotification : undefined,
    }

    if (selectedLocation && isLocationFulfillmentEnabled) {
      data.location_id = selectedLocation.value
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
        notification(
          t("returns-success", "Success"),
          t(
            "returns-successfully-returned-order",
            "Successfully returned order"
          ),
          "success"
        )
      )
      .catch((error) =>
        notification(
          t("returns-error", "Error"),
          getErrorMessage(error),
          "error"
        )
      )
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
    <LayeredModal context={layeredModalContext} handleClose={onDismiss}>
      <Modal.Body>
        <Modal.Header handleClose={onDismiss}>
          <h2 className="inter-xlarge-semibold">
            {t("returns-request-return", "Request Return")}
          </h2>
        </Modal.Header>
        <Modal.Content>
          <div className="mb-7">
            <h3 className="inter-base-semibold">
              {t("returns-items-to-return", "Items to return")}
            </h3>
            <RMASelectProductTable
              order={order}
              allItems={allItems}
              toReturn={toReturn}
              setToReturn={(items) => setToReturn(items)}
            />
          </div>

          {isLocationFulfillmentEnabled && (
            <div className="mb-8">
              <h3 className="inter-base-semibold ">Location</h3>
              <p className="inter-base-regular text-grey-50">
                {t(
                  "returns-choose-which-location-you-want-to-return-the-items-to",
                  "Choose which location you want to return the items to."
                )}
              </p>
              <Select
                className="mt-2"
                placeholder={t(
                  "returns-select-location-to-return-to",
                  "Select Location to Return to"
                )}
                value={selectedLocation}
                isMulti={false}
                onChange={setSelectedLocation}
                options={
                  stock_locations?.map((sl: StockLocationDTO) => ({
                    label: sl.name,
                    value: sl.id,
                  })) || []
                }
              />
              {!locationsHasInventoryLevels && (
                <div className="bg-orange-10 border-orange-20 rounded-rounded text-yellow-60 gap-x-base mt-4 flex border p-4">
                  <div className="text-orange-40">
                    <WarningCircleIcon size={20} fillType="solid" />
                  </div>
                  <div>
                    {t(
                      "returns-selected-location-has-no-inventory-levels",
                      "The selected location does not have inventory levels for the selected items. The return can be requested but can't be received until an inventory level is created for the selected location."
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div>
            <h3 className="inter-base-semibold ">
              {t("returns-shipping", "Shipping")}
            </h3>
            <p className="inter-base-regular text-grey-50">
              {t(
                "returns-choose-retur,-shipping-method",
                "Choose which shipping method you want to use for this return."
              )}
            </p>
            {shippingLoading ? (
              <div className="flex justify-center">
                <Spinner size="medium" variant="secondary" />
              </div>
            ) : (
              <Select
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
                  <span>{t("returns-shipping", "Shipping")}</span>
                  <div>
                    {displayAmount(order.currency_code, shippingPrice || 0)}{" "}
                    <span className="text-grey-40 ml-3">
                      {order.currency_code.toUpperCase()}
                    </span>
                  </div>
                </div>
              )}
              <div className="inter-base-semibold flex w-full justify-between">
                <span>{t("returns-total-refund", "Total Refund")}</span>
                <div className="flex items-center">
                  {!refundEdited && (
                    <>
                      <span
                        className="text-grey-40 mr-2 cursor-pointer"
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
                    label={t("returns-amount", "Amount")}
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
                className={`rounded-base border-grey-30 text-grey-0 flex h-5 w-5 justify-center border ${
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
              <span className="gap-x-xsmall text-grey-90 ml-3 flex items-center">
                {t("returns-send-notifications", "Send notifications")}
                <IconTooltip
                  content={t(
                    "returns-notify-customer-of-created-return",
                    "Notify customer of created return"
                  )}
                />
              </span>
            </div>
            <div className="gap-x-xsmall flex">
              <Button
                onClick={() => onDismiss()}
                className="w-[112px]"
                type="submit"
                size="small"
                variant="ghost"
              >
                {t("returns-back", "Back")}
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
                {t("returns-submit", "Submit")}
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </LayeredModal>
  )
}

export default ReturnMenu
