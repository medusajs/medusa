import { Controller, useForm, useWatch } from "react-hook-form"
import { LineItem, Order, ReservationItemDTO } from "@medusajs/medusa"
import { NestedForm, nestedForm } from "../../../../utils/nested-form"
import React, { useEffect, useMemo } from "react"
import {
  useAdminCreateReservation,
  useAdminStockLocations,
  useAdminVariantsInventory,
  useMedusa,
} from "medusa-react"

import Button from "../../../../components/fundamentals/button"
import CrossIcon from "../../../../components/fundamentals/icons/cross-icon"
import FocusModal from "../../../../components/molecules/modal/focus-modal"
import InputField from "../../../../components/molecules/input"
import Select from "../../../../components/molecules/select/next-select/select"
import Thumbnail from "../../../../components/atoms/thumbnail"
import clsx from "clsx"
import { getErrorMessage } from "../../../../utils/error-messages"
import { getFulfillableQuantity } from "../create-fulfillment/item-table"
import { sum } from "lodash"
import useNotification from "../../../../hooks/use-notification"

type AllocationModalFormData = {
  location?: { label: string; value: string }
  items: AllocationLineItemForm[]
}

type AllocateItemsModalProps = {
  order: Order
  reservationItemsMap: Record<string, ReservationItemDTO[]>
  close: () => void
}

const AllocateItemsModal: React.FC<AllocateItemsModalProps> = ({
  order,
  close,
  reservationItemsMap,
}) => {
  const { mutateAsync: createReservation } = useAdminCreateReservation()
  const { client: medusaClient } = useMedusa()
  const notification = useNotification()

  const form = useForm<AllocationModalFormData>({
    defaultValues: {
      items: [],
    },
  })

  const { handleSubmit, control } = form

  const selectedLocation = useWatch({ control, name: "location" })

  const { stock_locations, isLoading } = useAdminStockLocations()

  const locationOptions = useMemo(() => {
    if (!stock_locations) {
      return []
    }
    return stock_locations.map((sl) => ({
      value: sl.id,
      label: sl.name,
    }))
  }, [stock_locations])

  const onSubmit = async (data: AllocationModalFormData) => {
    if (!data.location?.value) {
      return
    }

    const results: { result?: ReservationItemDTO; error?: Error }[] =
      await Promise.all(
        data.items.map(async (item) => {
          if (!item.quantity) {
            return {}
          }
          return await createReservation({
            quantity: item.quantity,
            line_item_id: item.line_item_id,
            inventory_item_id: item.inventory_item_id,
            location_id: data.location!.value,
          })
            .then((result) => ({ result }))
            .catch((error: Error) => ({ error }))
        })
      )

    if (results.some((r) => r.error)) {
      await Promise.all(
        results.map(async ({ result }) => {
          if (result) {
            await medusaClient.admin.reservations.delete(result.id)
          }
        })
      )

      const error = results
        .filter(({ error }) => !!error)
        .map(({ error }) => getErrorMessage(error))
        .join(", ")

      notification("Couldn't allocate items", error, "error")
    } else {
      notification(
        "Items allocated",
        "Items have been allocated successfully",
        "success"
      )

      close()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FocusModal>
        <FocusModal.Header>
          <div className="medium:w-8/12 flex w-full justify-between px-8">
            <Button size="small" variant="ghost" type="button" onClick={close}>
              <CrossIcon size={20} />
            </Button>
            <div className="gap-x-small flex">
              <Button
                size="small"
                variant="secondary"
                type="button"
                onClick={close}
              >
                Cancel
              </Button>
              <Button size="small" variant="primary" type="submit">
                Save allocation
              </Button>
            </div>
          </div>
        </FocusModal.Header>
        <FocusModal.Main className="medium:w-6/12">
          {isLoading || !stock_locations ? (
            <div>Loading...</div>
          ) : (
            <div className="mt-16 flex flex-col">
              <h1 className="inter-xlarge-semibold">Allocate order items</h1>
              <div className="mt-6 flex w-full items-center justify-between">
                <div>
                  <p className="inter-base-semibold">Location</p>
                  <p className="inter-base-regular">
                    Choose where you wish to allocate from
                  </p>
                </div>
                <div className="w-1/2">
                  <Controller
                    name="location"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        value={value}
                        onChange={onChange}
                        options={locationOptions}
                      />
                    )}
                  />
                </div>
              </div>
              <div
                className={clsx(
                  "border-grey-20 mt-8 flex w-full flex-col border-t",
                  {
                    "pointer-events-none opacity-50": !selectedLocation?.value,
                  }
                )}
              >
                <div>
                  <p className="inter-base-semibold mt-8">Items to allocate</p>
                  <p className="inter-base-regular">
                    Select the number of items that you wish to allocate.
                  </p>
                  {order.items?.map((item, i) => {
                    return (
                      <AllocationLineItem
                        form={nestedForm(form, `items.${i}` as "items.0")}
                        item={item}
                        key={i}
                        locationId={selectedLocation?.value}
                        reservedQuantity={sum(
                          reservationItemsMap[item.id]?.map(
                            (reservation) => reservation.quantity
                          ) || []
                        )}
                      />
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </FocusModal.Main>
      </FocusModal>
    </form>
  )
}

export type AllocationLineItemForm = {
  inventory_item_id: string
  line_item_id: string
  quantity: number
}

export const AllocationLineItem: React.FC<{
  form: NestedForm<AllocationLineItemForm>
  item: LineItem
  locationId?: string
  reservedQuantity?: number
  compact?: boolean
}> = ({ form, item, locationId, reservedQuantity, compact }) => {
  const { variant, isLoading } = useAdminVariantsInventory(
    item.variant_id as string
  )

  const { register, path } = form

  form.setValue(path("line_item_id"), item.id)

  useEffect(() => {
    if (variant?.inventory?.length) {
      form.setValue(path("inventory_item_id"), variant.inventory[0].id)
    }
  }, [variant, form, path])

  const { availableQuantity, inStockQuantity } = useMemo(() => {
    if (isLoading || !locationId || !variant) {
      return {}
    }
    const { inventory } = variant
    const locationInventory = inventory?.[0]?.location_levels?.find(
      (inv) => inv.location_id === locationId
    )

    if (!locationInventory) {
      return {}
    }

    return {
      availableQuantity: locationInventory.available_quantity,
      inStockQuantity: locationInventory.stocked_quantity,
    }
  }, [variant, locationId, isLoading])

  if (!variant.inventory?.length) {
    return null
  }

  const lineItemReservationCapacity =
    getFulfillableQuantity(item) - (reservedQuantity || 0)

  const inventoryItemReservationCapacity =
    typeof availableQuantity === "number" ? availableQuantity : 0

  const maxReservation = Math.min(
    lineItemReservationCapacity,
    inventoryItemReservationCapacity
  )

  return (
    <div className="mt-8 flex w-full items-start justify-between">
      <div className="gap-x-base flex w-7/12">
        <div className="min-w-9">
          <Thumbnail size="medium" src={item.thumbnail} />
        </div>
        <div className="text-grey-50 truncate">
          <p className="gap-x-2xsmall nowrap flex grow ">
            <p className="inter-base-semibold text-grey-90 truncate">
              {item.title}
            </p>
            {`(${item.variant.sku})`}
          </p>
          <p className="inter-base-regular ">
            {item.variant.options?.map((option) => option.value) ||
              item.variant.title ||
              "-"}
          </p>
        </div>
      </div>
      <div
        className={clsx("gap-x-large flex items-center", {
          "gap-y-xsmall flex-col-reverse": compact,
        })}
      >
        <div
          className={clsx(
            "inter-base-regular text-grey-50 gap-x-xsmall flex items-end whitespace-nowrap",
            {
              "flex-col": !compact,
            }
          )}
        >
          <p>{availableQuantity || 0} available</p>
          <p>({inStockQuantity || 0} in stock)</p>
        </div>
        <InputField
          {...register(path(`quantity`), { valueAsNumber: true })}
          type="number"
          className="min-w-[120px]"
          defaultValue={0}
          disabled={lineItemReservationCapacity < 0}
          min={0}
          max={maxReservation > 0 ? maxReservation : 0}
          suffix={
            <span className="flex">
              {"/"}{" "}
              <span className="ml-1">
                {maxReservation > 0 ? maxReservation : 0}
              </span>
            </span>
          }
        />
      </div>
    </div>
  )
}

export default AllocateItemsModal
