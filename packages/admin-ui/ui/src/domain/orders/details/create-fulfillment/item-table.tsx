import React, { useMemo } from "react"
import { useTranslation } from "react-i18next"

import FeatureToggle from "../../../../components/fundamentals/feature-toggle"
import ImagePlaceholder from "../../../../components/fundamentals/image-placeholder"
import InputField from "../../../../components/molecules/input"
import { LineItem } from "@medusajs/medusa"
import clsx from "clsx"
import { useAdminVariantsInventory } from "medusa-react"
import { useFeatureFlag } from "../../../../providers/feature-flag-provider"

export const getFulfillableQuantity = (item: LineItem): number => {
  return item.quantity - (item.fulfilled_quantity || 0)
}

const CreateFulfillmentItemsTable = ({
  items,
  quantities,
  setQuantities,
  locationId,
  setErrors,
}: {
  items: LineItem[]
  quantities: Record<string, number>
  setQuantities: (quantities: Record<string, number>) => void
  locationId?: string
  setErrors: (errors: React.SetStateAction<{}>) => void
}) => {
  const handleQuantityUpdate = React.useCallback(
    (value: number, id: string) => {
      let newQuantities = { ...quantities }

      newQuantities = {
        ...newQuantities,
        [id]: value,
      }

      setQuantities(newQuantities)
    },
    [quantities, setQuantities]
  )

  return (
    <div>
      {items.map((item, idx) => {
        return (
          <FulfillmentLine
            item={item}
            locationId={locationId}
            key={`fulfillmentLine-${idx}`}
            quantities={quantities}
            handleQuantityUpdate={handleQuantityUpdate}
            setErrors={setErrors}
          />
        )
      })}
    </div>
  )
}

const FulfillmentLine = ({
  item,
  locationId,
  quantities,
  handleQuantityUpdate,
  setErrors,
}: {
  locationId?: string
  item: LineItem
  quantities: Record<string, number>
  handleQuantityUpdate: (value: number, id: string) => void
  setErrors: (errors: Record<string, string>) => void
}) => {
  const { t } = useTranslation()
  const { isFeatureEnabled } = useFeatureFlag()
  const isLocationFulfillmentEnabled =
    isFeatureEnabled("inventoryService") &&
    isFeatureEnabled("stockLocationService")

  const { variant, isLoading, refetch } = useAdminVariantsInventory(
    item.variant_id as string,
    { enabled: isLocationFulfillmentEnabled }
  )

  const hasInventoryItem = !!variant?.inventory.length

  React.useEffect(() => {
    if (isLocationFulfillmentEnabled) {
      refetch()
    }
  }, [isLocationFulfillmentEnabled, refetch])

  const { availableQuantity, inStockQuantity } = useMemo(() => {
    if (!isLocationFulfillmentEnabled) {
      return {
        availableQuantity: item.variant.inventory_quantity,
        inStockQuantity: item.variant.inventory_quantity,
      }
    }

    if (isLoading || !locationId || !variant) {
      return {}
    }

    const { inventory } = variant

    const locationInventory = inventory[0]?.location_levels?.find(
      (inv) => inv.location_id === locationId
    )

    if (!locationInventory) {
      return {}
    }

    return {
      availableQuantity: locationInventory.available_quantity,
      inStockQuantity: locationInventory.stocked_quantity,
    }
  }, [
    isLoading,
    locationId,
    variant,
    item.variant,
    isLocationFulfillmentEnabled,
  ])

  const validQuantity =
    !locationId ||
    (locationId &&
      (!availableQuantity || quantities[item.id] <= availableQuantity))

  React.useEffect(() => {
    setErrors((errors) => {
      if (validQuantity) {
        delete errors[item.id]
        return errors
      }

      errors[item.id] = t(
        "create-fulfillment-quantity-is-not-valid",
        "Quantity is not valid"
      )
      return errors
    })
  }, [validQuantity, setErrors, item.id])

  React.useEffect(() => {
    if (!availableQuantity && hasInventoryItem) {
      handleQuantityUpdate(0, item.id)
    } else {
      handleQuantityUpdate(
        Math.min(
          getFulfillableQuantity(item),
          ...[hasInventoryItem ? availableQuantity : Number.MAX_VALUE]
        ),
        item.id
      )
    }
    // Note: we can't add handleQuantityUpdate to the dependency array as it will cause an infinite loop
  }, [availableQuantity, item, item.id])

  if (getFulfillableQuantity(item) <= 0) {
    return null
  }

  return (
    <div
      className={clsx(
        "rounded-rounded hover:bg-grey-5 mx-[-5px] mb-1 flex h-[64px] justify-between py-2 px-[5px]",
        {
          "pointer-events-none opacity-50":
            (!availableQuantity && hasInventoryItem) ||
            (!locationId && isLocationFulfillmentEnabled),
        }
      )}
    >
      <div className="flex justify-center space-x-4">
        <div className="rounded-rounded flex h-[48px] w-[36px] overflow-hidden">
          {item.thumbnail ? (
            <img src={item.thumbnail} className="object-cover" />
          ) : (
            <ImagePlaceholder />
          )}
        </div>
        <div className="flex max-w-[185px] flex-col justify-center">
          <span className="inter-small-regular text-grey-90 truncate">
            {item.title}
          </span>
          {item?.variant && (
            <span className="inter-small-regular text-grey-50 truncate">
              {`${item.variant.title}${
                item.variant.sku ? ` (${item.variant.sku})` : ""
              }`}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center">
        <FeatureToggle featureFlag="inventoryService">
          {hasInventoryItem && (
            <div className="inter-base-regular text-grey-50 mr-6 flex flex-col items-end whitespace-nowrap">
              <p>{availableQuantity || 0} available</p>
              <p>({inStockQuantity || 0} in stock)</p>
            </div>
          )}
        </FeatureToggle>
        <InputField
          type="number"
          name={`quantity`}
          defaultValue={getFulfillableQuantity(item)}
          min={0}
          suffix={
            <span className="flex">
              {"/"}
              <span className="pl-1">{getFulfillableQuantity(item)}</span>
            </span>
          }
          value={quantities[item.id]}
          max={Math.min(
            getFulfillableQuantity(item),
            ...[hasInventoryItem ? availableQuantity || 0 : Number.MAX_VALUE]
          )}
          onChange={(e) =>
            handleQuantityUpdate(e.target.valueAsNumber, item.id)
          }
          errors={
            validQuantity
              ? undefined
              : {
                  quantity: t(
                    "create-fulfillment-quantity-is-not-valid",
                    "Quantity is not valid"
                  ),
                }
          }
        />
      </div>
    </div>
  )
}
export default CreateFulfillmentItemsTable
