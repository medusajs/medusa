import { AllocationLineItemForm } from "./allocate-items-modal"
import { Controller, useForm, useWatch } from "react-hook-form"
import { LineItem, ReservationItemDTO } from "@medusajs/medusa"
import {
  useAdminDeleteReservation,
  useAdminStockLocations,
  useAdminUpdateReservation,
  useAdminVariantsInventory,
} from "medusa-react"
import { useEffect, useMemo } from "react"

import Button from "../../../../components/fundamentals/button"
import CrossIcon from "../../../../components/fundamentals/icons/cross-icon"
import Select from "../../../../components/molecules/select/next-select/select"
import SideModal from "../../../../components/molecules/modal/side-modal"
import useNotification from "../../../../hooks/use-notification"
import Thumbnail from "../../../../components/atoms/thumbnail"
import { getFulfillableQuantity } from "../create-fulfillment/item-table"

type EditAllocationLineItemForm = {
  location: { label: string; value: string }
  item: AllocationLineItemForm
}

const EditAllocationDrawer = ({
  close,
  reservation,
  item,
  totalReservedQuantity,
}: {
  close: () => void
  reservation?: ReservationItemDTO
  item: LineItem
  totalReservedQuantity: number
}) => {
  const form = useForm<EditAllocationLineItemForm>()

  const { control, setValue, handleSubmit } = form

  const { stock_locations, isLoading: isLoadingStockLocations } =
    useAdminStockLocations()

  const { variant, isLoading } = useAdminVariantsInventory(
    item.variant_id as string
  )

  const { mutate: updateReservation } = useAdminUpdateReservation(
    reservation?.id || ""
  )
  const { mutate: deleteReservation } = useAdminDeleteReservation(
    reservation?.id || ""
  )

  const locationOptions = useMemo(() => {
    if (!stock_locations || isLoadingStockLocations) {
      return []
    }
    return stock_locations.map((sl) => ({
      value: sl.id,
      label: sl.name,
    }))
  }, [isLoadingStockLocations, stock_locations])

  const notification = useNotification()
  const handleDelete = () => {
    deleteReservation(undefined, {
      onSuccess: () => {
        notification(
          "Allocation was deleted",
          "The allocated items have been released.",
          "success"
        )
        close()
      },
      onError: () => {
        notification("Error", "Failed to delete the allocation ", "error")
      },
    })
  }

  const selectedLocation = useWatch({
    control,
    name: "location",
  })

  useEffect(() => {
    if (stock_locations?.length && reservation) {
      const defaultLocation = stock_locations.find(
        (sl) => sl.id === reservation.location_id
      )

      if (defaultLocation) {
        setValue("location", {
          value: defaultLocation?.id,
          label: defaultLocation?.name,
        })
      }
    }
  }, [stock_locations, reservation, setValue])

  useEffect(() => {
    if (reservation) {
      setValue("item.quantity", reservation?.quantity)
    }
  }, [reservation, setValue])

  const submit = (data: EditAllocationLineItemForm) => {
    if (!data.item.quantity) {
      return handleDelete()
    }

    updateReservation(
      {
        quantity: data.item.quantity,
        location_id: data.location.value,
      },
      {
        onSuccess: () => {
          notification(
            "Allocation was updated",
            "The allocation change was saved.",
            "success"
          )
          close()
        },
        onError: () => {
          notification("Errors", "Failed to update allocation", "error")
        },
      }
    )
  }

  const { availableQuantity, inStockQuantity } = useMemo(() => {
    if (isLoading || !selectedLocation?.value || !variant) {
      return {}
    }
    const { inventory } = variant
    const locationInventory = inventory[0].location_levels?.find(
      (inv) => inv.location_id === selectedLocation?.value
    )
    if (!locationInventory) {
      return {}
    }
    return {
      availableQuantity: locationInventory.available_quantity,
      inStockQuantity: locationInventory.stocked_quantity,
    }
  }, [variant, selectedLocation, isLoading])

  // we can adjust up to fulfillable quantity - the quantity reserved in other reservations
  const lineItemReservationCapacity =
    getFulfillableQuantity(item) -
    (totalReservedQuantity - (reservation?.quantity || 0))

  const inventoryItemReservationCapacity =
    typeof availableQuantity === "number" ? availableQuantity : 0

  const maxReservation = Math.min(
    lineItemReservationCapacity,
    inventoryItemReservationCapacity
  )

  return (
    <SideModal isVisible close={close}>
      <form
        className="text-grey-90 h-full w-full"
        onSubmit={handleSubmit(submit)}
      >
        <div className="flex h-full flex-col justify-between">
          <div className="flex grow flex-col">
            <div className="border-grey-20 flex items-center justify-between border-b px-8 py-6">
              <h1 className="inter-large-semibold ">Edit allocation</h1>
              <Button variant="ghost" className="p-1.5" onClick={close}>
                <CrossIcon />
              </Button>
            </div>
            <div className="flex h-full flex-col justify-between gap-y-8 px-8 pb-8 pt-6">
              <div>
                <h2 className="inter-base-semibold">Location</h2>
                <span className="inter-base-regular text-grey-50">
                  Choose which location you want to ship the items from.
                </span>
                <Controller
                  name="location"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      className="mt-4"
                      value={value}
                      onChange={onChange}
                      options={locationOptions}
                    />
                  )}
                />
                <div>
                  <h2 className="inter-base-semibold mt-8">
                    Items to Allocate
                  </h2>
                  <span className="inter-base-regular text-grey-50">
                    Select the number of items that you wish to allocate.
                  </span>
                  <div className="gap-x-base mt-6 flex w-full">
                    <div className="min-w-9">
                      <Thumbnail size="medium" src={item.thumbnail} />
                    </div>
                    <div className="text-grey-50 truncate">
                      <p className="inter-base-semibold text-grey-90 truncate">
                        {item.title}
                      </p>
                      <p className="inter-base-semibold gap-x-2xsmall flex">
                        <p>{`(${item.variant.sku})`}</p>
                        <span>&#183;</span>
                        <span className="inter-base-regular gap-x-2xsmall flex">
                          {item.variant.options
                            ?.map((option, i) => [
                              <span key={`${option.id}-${i}`}>
                                {option.value}
                              </span>,
                              <span key={`${option.id}-${i}.dot`}>&#183;</span>,
                            ])
                            .flat()
                            .slice(0, -1) ||
                            item.variant.title ||
                            "-"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div
                    className={`
                  bg-grey-5 text-grey-50 border-grey-20 
                  mt-8
                  grid border-collapse grid-cols-2 grid-rows-3 
                  [&>*]:border-r [&>*]:border-b [&>*]:py-2 
                  [&>*:nth-child(odd)]:border-l [&>*:nth-child(odd)]:pl-4 
                  [&>*:nth-child(even)]:pr-4 [&>*:nth-child(even)]:text-right 
                  [&>*:nth-child(-n+2)]:border-t`}
                  >
                    <div className="rounded-tl-rounded">In stock</div>
                    <div className="rounded-tr-rounded">
                      {inStockQuantity ?? "N/A"}
                    </div>
                    <div className="">Available</div>
                    <div className="">{availableQuantity ?? "N/A"}</div>
                    <div className="rounded-bl-rounded">Allocate</div>
                    <div className="bg-grey-0 rounded-br-rounded text-grey-80 flex items-center">
                      <input
                        className="remove-number-spinner inter-base-regular w-full shrink border-none bg-transparent text-right font-normal outline-none outline-0"
                        {...form.register("item.quantity", {
                          valueAsNumber: true,
                        })}
                        type="number"
                        min={0}
                        max={maxReservation}
                      />
                      <span className="text-grey-50 nowrap whitespace-nowrap pl-2">{` / ${maxReservation} requested`}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                className="my-1 w-full border text-rose-50"
                size="small"
                onClick={handleDelete}
                type="button"
              >
                Delete allocation
              </Button>
            </div>
          </div>
          <div className="gap-x-xsmall flex w-full justify-end border-t px-8 pt-4 pb-6">
            <Button
              variant="ghost"
              size="small"
              className="border"
              onClick={close}
            >
              Cancel
            </Button>
            <Button variant="primary" size="small" type="submit">
              Save and close
            </Button>
          </div>
        </div>
      </form>
    </SideModal>
  )
}

export default EditAllocationDrawer
