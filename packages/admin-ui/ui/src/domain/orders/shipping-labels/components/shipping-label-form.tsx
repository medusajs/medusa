import React, { FC, useEffect, useMemo, useState } from "react"
import {
  AdminPostOrdersOrderClaimsClaimFulfillmentsReq,
  AdminPostOrdersOrderSwapsSwapFulfillmentsReq,
  Location,
  Order,
  ShipEngineRate,
} from "@medusajs/medusa"
import { useAdminFulfillClaim, useAdminFulfillSwap } from "medusa-react"
import { AddressCreatePayload } from "@medusajs/medusa/dist/types/common"
import Checkbox from "../../../../components/atoms/checkbox"
import Spinner from "../../../../components/atoms/spinner"
import Button from "../../../../components/fundamentals/button"
import EditIcon from "../../../../components/fundamentals/icons/edit-icon"
import IconTooltip from "../../../../components/molecules/icon-tooltip"
import Input from "../../../../components/molecules/input"
import Select from "../../../../components/molecules/select"
import BodyCard from "../../../../components/organisms/body-card"
import RadioGroup from "../../../../components/organisms/radio-group"
import { useAdminGetShipEngineRates } from "../../../../hooks/admin/shipengine"
import useNotification from "../../../../hooks/use-notification"
import { addressToAddressPayload } from "../../../../utils/address-to-address-payload"
import { getErrorMessage } from "../../../../utils/error-messages"
import { formatAmountWithSymbol } from "../../../../utils/prices"
import { useBasePath } from "../../../../utils/routePathing"
import CreateFulfillmentItemsTable from "../../details/create-fulfillment/item-table"
import { FormattedAddress } from "../../fulfillments/components/formatted-address"
import {
  calculatePackageWeight,
  formatShippingPackageOption,
  getPackageItems,
  useShippingDateOptions,
} from "../helpers"
import {
  ShippingPackageItemsQuantityMap,
  ShippingPackageOption,
} from "../types"
import { EditAddressModal } from "./edit-address-modal"
import {
  CreateShipEngineFulfillmentRequest,
  useAdminCreateShipEngineFulfillment,
} from "../../../../hooks/admin/fulfillments"
import { useSelectedVendor } from "../../../../context/vendor"
import { useAdminVendorPackages } from "../../../../hooks/admin/packages/queries"
import { PackageModal } from "../../../../components/templates/vendor-package/package-modal"
import PlusIcon from "../../../../components/fundamentals/icons/plus-icon"
import { useVendorSettingsBasePath } from "../../../vendors/helpers"
import { Link, Navigate, useNavigate } from "react-router-dom"
import RequestTopupModal from "../../../balance/components/request-topup-modal"
import { AxiosError } from "axios"

export interface ShippingLabelFormProps {
  // TODO: Need to support claims and swaps in the future.
  // order: Order | ClaimOrder | Swap
  order: Order
  location: Location
}

export const ShippingLabelForm: FC<ShippingLabelFormProps> = ({
  order,
  location,
}) => {
  const navigate = useNavigate()
  const { isStoreView, selectedVendor } = useSelectedVendor()
  const basePath = useBasePath()
  const notification = useNotification()
  const shippingDateOptions = useShippingDateOptions()
  const vendorLocationsPath = useVendorSettingsBasePath(
    order.vendor_id,
    "/locations"
  )

  const [editAddress, setEditAddress] = useState<boolean>(false)
  const [addPackage, setAddPackage] = useState<boolean>(false)
  const [requestTopupModalOpen, setRequestTopupModalOpen] =
    useState<boolean>(false)
  const [shippingRates, setShippingRates] = useState<ShipEngineRate[]>([])
  const [toFulfill, setToFulfill] = useState<string[]>([])
  const [quantities, setQuantities] = useState<ShippingPackageItemsQuantityMap>(
    {}
  )
  const [totalWeight, setTotalWeight] = useState<number>(0)
  const [selectedShippingPackageOption, setSelectedShippingPackageOption] =
    useState<ShippingPackageOption | null | undefined>()
  const [shippingRateId, setShippingRateId] = useState<string | undefined>()
  const [shippingDate, setShippingDate] = useState<{
    label: string
    value: string
  }>(shippingDateOptions[0])
  const [sendNotifications, setSendNotifications] = useState(true)
  const [toAddress, setToAddress] = useState<
    AddressCreatePayload | null | undefined
  >(addressToAddressPayload(order.shipping_address))
  const [fromAddress] = useState<AddressCreatePayload | null | undefined>(
    addressToAddressPayload(location?.address)
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { packages: shippingPackages, refetch: refetchPackages } =
    useAdminVendorPackages(selectedVendor?.id)
  const getShipEngineRates = useAdminGetShipEngineRates()
  const createOrderFulfillment = useAdminCreateShipEngineFulfillment(order.id)

  // QUESTION: How are we handling swaps and claims w/ ShipEngine?
  const createSwapFulfillment = useAdminFulfillSwap(order.id)
  const createClaimFulfillment = useAdminFulfillClaim(order.id)

  // TODO: Need to support claims and swaps in the future.
  // const items = "items" in order ? order.items : order.additional_items
  const orderItems = order.items
  const orderDisplayId = "display_id" in order ? order.display_id : order.id

  const hasItems = useMemo(
    () =>
      toFulfill.length > 0 &&
      Object.values(quantities).some((quantity: number) => quantity > 0),
    [toFulfill, quantities]
  )

  const shouldShowRates = useMemo(
    () => hasItems && totalWeight > 0,
    [hasItems, totalWeight]
  )

  const canCreateLabel = useMemo(
    () => shouldShowRates && !!shippingRateId && !isSubmitting,
    [shouldShowRates, shippingRateId, isSubmitting]
  )

  /*
   * Map the `shippingRateId` to the actual shipping rate.
   */
  const shippingRate = useMemo(
    () => shippingRates.find((rate) => rate.rate_id === shippingRateId),
    [shippingRates, shippingRateId]
  )

  /*
   * Map the `selectedShippingPackageOption` to the actual package.
   */
  const shippingPackage = useMemo(
    () =>
      shippingPackages?.find(
        (pkg) => pkg.id === selectedShippingPackageOption?.value
      ),
    [selectedShippingPackageOption]
  )

  const fetchShipEngineRates = () => {
    if (!shouldShowRates) {
      return
    }

    if (!toAddress) {
      return notification(
        "Missing shipping address",
        "You can't create a shipping label without a shipping address.",
        "error"
      )
    }

    if (!fromAddress) {
      return notification(
        "Missing location",
        "You must set up a location in your vendor settings before you can create a shipping label.",
        "error"
      )
    }

    if (!shippingPackage) {
      return notification(
        "Missing shipping package",
        "Please select a shipping package to fetch rates.",
        "error"
      )
    }

    if (!getShipEngineRates.isLoading) {
      notification(
        "Fetching shipping service rates",
        "Scroll down to see and select the appropriate service for this shipping label.",
        "info"
      )
    }

    const payload = {
      to_address: toAddress,
      from_address: fromAddress,
      weight: totalWeight,
      dimensions: {
        width: shippingPackage.width ? shippingPackage.width : 0,
        height: shippingPackage.height ? shippingPackage.height : 0.05,
        length: shippingPackage.length ? shippingPackage.length : 0,
      },
      ship_date: shippingDate.value,
    }

    getShipEngineRates.mutate(payload, {
      onSuccess: ({ data }) => {
        const { rates } = data
        const { shipping_option: shippingOption } = order.shipping_methods[0]

        const defaultShippingRate = shippingOption
          ? rates.find(
              (rate) =>
                rate.carrier_id === shippingOption.data.carrier_id &&
                rate.service_code === shippingOption.data.service_code
            )
          : data.rates[0]

        setShippingRates(data.rates)
        setShippingRateId(defaultShippingRate?.rate_id)
      },
    })
  }

  /*
   * Set the default `selectedShippingPackageOption` after packages have loaded.
   */
  useEffect(() => {
    const defaultShippingPackage = (shippingPackages || [])[0]

    if (defaultShippingPackage) {
      setSelectedShippingPackageOption(
        formatShippingPackageOption(defaultShippingPackage)
      )
    }
  }, [shippingPackages])

  const shippingPackageOptions = useMemo(
    () =>
      shippingPackages?.map((pkg) => formatShippingPackageOption(pkg)) ?? [],
    [shippingPackages]
  )

  /*
   * Update the `totalWeight` based on the other fields.
   */
  useEffect(() => {
    if (!shippingPackages || !shippingPackage) {
      return
    }

    const packageItems = getPackageItems(order, toFulfill, quantities)
    setTotalWeight(calculatePackageWeight(packageItems, shippingPackage))
  }, [order, toFulfill, quantities, shippingPackage])

  /*
   * Fetch the rate from ShipEngine when the relevant fields change.
   */
  useEffect(() => {
    fetchShipEngineRates()
  }, [toAddress, fromAddress, totalWeight, shippingPackage, shippingDate])

  /*
   * Return to the order detail page on cancel.
   */
  const handleCancel = () => {
    navigate(`${basePath}/orders/${order.id}`)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setIsSubmitting(true)

    const [type] = order.id.split("_")

    type actionType =
      | typeof createOrderFulfillment
      | typeof createSwapFulfillment
      | typeof createClaimFulfillment

    let action: actionType = createOrderFulfillment
    let requestObj

    switch (type) {
      case "swap":
        action = createSwapFulfillment
        requestObj = {
          swap_id: order.id,
          no_notification: !sendNotifications,
        } as AdminPostOrdersOrderSwapsSwapFulfillmentsReq
        break

      case "claim":
        action = createClaimFulfillment
        requestObj = {
          claim_id: order.id,
          no_notification: !sendNotifications,
        } as AdminPostOrdersOrderClaimsClaimFulfillmentsReq
        break

      default:
        requestObj = {
          no_notification: !sendNotifications,
          rate_id: shippingRateId,
        } as CreateShipEngineFulfillmentRequest
        requestObj.items = toFulfill
          .map((itemId) => ({ item_id: itemId, quantity: quantities[itemId] }))
          .filter((t) => !!t)
        break
    }

    action.mutate(requestObj, {
      onSuccess: () => {
        notification(
          "Success",
          "Successfully purchased shipping label",
          "success"
        )
        navigate(`${basePath}/orders/${order.id}`)
      },
      onError: (err: Error) => {
        console.error(err)
        setIsSubmitting(false)

        if (
          (err as AxiosError)?.response?.data?.code ===
          "insufficient_balance_available"
        ) {
          return setRequestTopupModalOpen(true)
        }

        notification("Error", getErrorMessage(err), "error")
      },
    })
  }

  if (isStoreView) return <Navigate to={`/admin/orders/${order.id}`} />

  return (
    <>
      <form className="grid grid-cols-12 gap-4 pb-12">
        <div className="col-span-7">
          <BodyCard
            title="Create Shipping Label"
            subtitle={
              <div className="flex gap-2 text-base">
                <span>Order # {orderDisplayId}</span>
                <span>|</span>
                <span>
                  {new Date(order.created_at).toLocaleDateString("us", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            }
            className="min-h-0"
          >
            <div className="space-y-8 divide-y">
              <div className="flex mt-2 space-x-6 divide-x">
                <div className="grow">
                  <div className="inter-small-regular text-grey-50 mb-1 whitespace-pre">
                    Shipping method
                  </div>
                  <div className="text-grey-90 active:text-violet-90 gap-x-1 flex items-center">
                    <span>
                      {order.shipping_methods[0]?.shipping_option.name ??
                        "None"}
                    </span>
                  </div>
                </div>

                <div className="pl-6 grow">
                  <div className="inter-small-regular text-grey-50 mb-1">
                    Shipping to
                  </div>
                  <FormattedAddress address={toAddress} />
                  <button
                    type="button"
                    className="mt-1 flex items-center gap-1 text-violet-60 cursor-pointer"
                    onClick={() => setEditAddress(true)}
                  >
                    <EditIcon size={16} /> Edit address
                  </button>
                </div>

                <div className="pl-6 grow">
                  <div className="inter-small-regular text-grey-50 mb-1">
                    Shipping from
                  </div>
                  <FormattedAddress address={fromAddress} />
                  {!fromAddress && (
                    <Link
                      className="mt-1 text-violet-60 cursor-pointer"
                      to={vendorLocationsPath}
                    >
                      Setup a location
                    </Link>
                  )}
                </div>
              </div>

              <div className="pt-8">
                <h3 className="inter-large-semibold text-grey-90 mt-0 mb-2">
                  Items
                </h3>
                <CreateFulfillmentItemsTable
                  items={orderItems}
                  toFulfill={toFulfill}
                  setToFulfill={setToFulfill}
                  quantities={quantities}
                  setQuantities={setQuantities}
                />
              </div>

              <div className="pt-8">
                <div className="flex justify-between mb-4">
                  <h3 className="inter-large-semibold text-grey-90 mt-0">
                    Package and weight
                  </h3>
                  <button
                    type="button"
                    className="flex shrink-0 items-center gap-1 text-left text-violet-60"
                    onClick={() => setAddPackage(true)}
                  >
                    <PlusIcon /> New package
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  {shippingPackages && shippingPackages.length > 0 && (
                    <Select
                      label="Package"
                      options={shippingPackageOptions}
                      value={
                        selectedShippingPackageOption
                          ? selectedShippingPackageOption
                          : formatShippingPackageOption(shippingPackages[0])
                      }
                      onChange={(value) =>
                        setSelectedShippingPackageOption(value)
                      }
                    />
                  )}

                  <Input
                    name="total_weight"
                    label="Total weight (with package)"
                    type="number"
                    step="0.1"
                    min="0"
                    value={totalWeight}
                    onChange={(e) => setTotalWeight(parseFloat(e.target.value))}
                  />
                </div>
              </div>

              {shouldShowRates && (
                <div className="pt-8">
                  <h3 className="inter-large-semibold text-grey-90 mt-0 mb-4">
                    Shipping service
                  </h3>

                  {getShipEngineRates.isLoading && (
                    <div className="flex items-center justify-center">
                      <Spinner size={"large"} variant={"secondary"} />
                    </div>
                  )}

                  {!getShipEngineRates.isLoading && shippingRates && (
                    <RadioGroup.Root
                      value={shippingRateId}
                      onValueChange={setShippingRateId}
                    >
                      {shippingRates.map((rate) => (
                        <RadioGroup.Item
                          key={rate.rate_id}
                          value={rate.rate_id}
                          label={rate.service_type}
                          sublabel={
                            <span className="text-base">
                              (
                              {formatAmountWithSymbol({
                                amount: rate.shipping_amount.amount * 100,
                                currency: rate.shipping_amount.currency,
                              })}
                              )
                            </span>
                          }
                          checked={rate.rate_id === shippingRateId}
                          description={`${rate.delivery_days} business day${
                            rate.delivery_days > 1 ? "s" : ""
                          }`}
                        />
                      ))}
                    </RadioGroup.Root>
                  )}

                  {!getShipEngineRates.isLoading &&
                    shippingRates.length < 1 && (
                      <>No rates are available for a package of that size.</>
                    )}
                </div>
              )}
            </div>
          </BodyCard>
        </div>

        <div className="col-span-5">
          <BodyCard
            title="Summary"
            className="sticky top-0 h-auto min-h-0 grow-0"
          >
            <div className="space-y-8 divide-y">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between">
                  <div className="inter-smaller-regular text-grey-50 mb-1">
                    Subtotal
                  </div>
                  <div className="text-grey-90 active:text-violet-90 cursor-pointer gap-x-1 flex items-center">
                    {shippingRate && (
                      <>
                        {formatAmountWithSymbol({
                          amount: shippingRate.shipping_amount.amount * 100,
                          currency: shippingRate.shipping_amount.currency,
                        })}

                        <div className="text-grey-50">
                          {shippingRate.shipping_amount.currency.toUpperCase()}
                        </div>
                      </>
                    )}
                    {!shippingRate && <>&mdash;</>}
                  </div>
                </div>

                <div className="flex justify-between inter-large-semibold text-grey-90">
                  <div>Total</div>
                  <div>
                    {shippingRate && (
                      <>
                        {formatAmountWithSymbol({
                          amount: shippingRate.shipping_amount.amount * 100,
                          currency: shippingRate.shipping_amount.currency,
                        })}
                      </>
                    )}
                    {!shippingRate && <>&mdash;</>}
                  </div>
                </div>
              </div>

              <div className="pt-8 flex flex-col gap-4">
                <Select
                  label="Shipping date"
                  options={shippingDateOptions}
                  value={shippingDate}
                  onChange={(values) => setShippingDate(values)}
                />

                <Checkbox
                  label={
                    <span className="inline-flex items-center gap-x-xsmall">
                      Send shipping information to customers now.
                      <IconTooltip content="" />
                    </span>
                  }
                  onChange={() => setSendNotifications(!sendNotifications)}
                  checked={sendNotifications}
                />
              </div>

              <div className="pt-8 flex flex-col gap-4">
                <Button
                  size="large"
                  className="justify-center"
                  variant="primary"
                  disabled={!canCreateLabel}
                  onClick={handleSubmit}
                >
                  {isSubmitting ? "Submitting" : "Buy shipping label"}
                </Button>
                <Button
                  variant="secondary"
                  className="justify-center"
                  size="large"
                  disabled={isSubmitting}
                  onClick={handleCancel}
                  type="button"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </BodyCard>
        </div>
      </form>

      {toAddress && editAddress && (
        <EditAddressModal
          address={toAddress}
          onClose={() => setEditAddress(false)}
          onSave={(values) => {
            setToAddress(values)
            setEditAddress(false)
          }}
        />
      )}

      {addPackage && selectedVendor && (
        <PackageModal
          vendor={selectedVendor}
          onClose={() => {
            setAddPackage(false)
          }}
          onSuccess={() => {
            refetchPackages()
          }}
        />
      )}

      {requestTopupModalOpen && (
        <RequestTopupModal
          open={requestTopupModalOpen}
          message="You don't have enough funds in your balance to buy this shipping label. Please add funds to your balance."
          handleClose={() => setRequestTopupModalOpen(false)}
        />
      )}
    </>
  )
}
