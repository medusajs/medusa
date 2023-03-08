import { useEffect, useMemo } from "react"
import CrossIcon from "../../../../components/fundamentals/icons/cross-icon"
import Button from "../../../../components/fundamentals/button"
import {
  AllocationLineItem,
  AllocationLineItemForm,
} from "./allocate-items-modal"
import { Controller, useForm, useWatch } from "react-hook-form"
import {
  useAdminDeleteReservation,
  useAdminStockLocations,
  useAdminUpdateReservation,
} from "medusa-react"
import Select from "../../../../components/molecules/select/next-select/select"
import { LineItem, ReservationItemDTO } from "@medusajs/medusa"
import useNotification from "../../../../hooks/use-notification"
import { nestedForm } from "../../../../utils/nested-form"
import SideModal from "../../../../components/molecules/modal/side-modal"

type EditAllocationLineItemForm = {
  location: { label: string; value: string }
  item: AllocationLineItemForm
}

const EditAllocationDrawer = ({
  close,
  reservation,
  item,
  sales_channel_id,
  totalReservedQuantity,
}: {
  close: () => void
  reservation?: ReservationItemDTO
  item: LineItem
  totalReservedQuantity: number
  sales_channel_id?: string
}) => {
  const form = useForm<EditAllocationLineItemForm>()

  const { control, setValue, handleSubmit } = form

  // if not sales channel is present fetch all locations
  const stockLocationsFilter: { sales_channel_id?: string } = {}
  if (sales_channel_id) {
    stockLocationsFilter.sales_channel_id = sales_channel_id
  }

  const { stock_locations } = useAdminStockLocations(stockLocationsFilter)

  const { mutate: updateReservation } = useAdminUpdateReservation(
    reservation?.id || ""
  )
  const { mutate: deleteReservation } = useAdminDeleteReservation(
    reservation?.id || ""
  )

  const locationOptions = useMemo(() => {
    if (!stock_locations) {
      return []
    }
    return stock_locations.map((sl) => ({
      value: sl.id,
      label: sl.name,
    }))
  }, [stock_locations])

  const notification = useNotification()
  const handleDelete = () => {
    deleteReservation(undefined, {
      onSuccess: () => {
        notification("Success", "Allocation deleted successfully", "success")
        close()
      },
      onError: () => {
        notification("Errors", "Failed to deleted ", "success")
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
    updateReservation(
      {
        quantity: data.item.quantity,
        location_id: data.location.value,
        inventory_item_id: data.item.inventory_item_id,
      },
      {
        onSuccess: () => {
          notification("Success", "Allocation updated successfully", "success")
          close()
        },
        onError: () => {
          notification("Errors", "Failed to update allocation", "error")
        },
      }
    )
  }

  return (
    <SideModal isVisible close={close}>
      <form
        className="w-full h-full text-grey-90"
        onSubmit={handleSubmit(submit)}
      >
        <div className="flex flex-col justify-between h-full ">
          <div>
            <div className="flex items-center justify-between px-8 py-6 border-b border-grey-20">
              <h1 className="inter-large-semibold ">Edit allocation</h1>
              <Button variant="ghost" className="p-1.5" onClick={close}>
                <CrossIcon />
              </Button>
            </div>
            <div className="flex flex-col px-8 pt-6 gap-y-8">
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
                      value={value}
                      onChange={onChange}
                      options={locationOptions}
                    />
                  )}
                />
              </div>
              <div>
                <h2 className="inter-base-semibold">Items to Allocate</h2>
                <span className="inter-base-regular text-grey-50">
                  Select the number of items that you wish to allocate.
                </span>
                <AllocationLineItem
                  form={nestedForm(form, `item` as "item")}
                  item={item}
                  locationId={selectedLocation?.value}
                  reservedQuantity={
                    totalReservedQuantity - (reservation?.quantity || 0)
                  }
                />
              </div>
              <Button
                variant="ghost"
                className="w-full my-1 border text-rose-50"
                size="small"
                onClick={handleDelete}
              >
                Delete allocation
              </Button>
            </div>
          </div>
          <div className="flex justify-end w-full px-8 pt-4 pb-6 border-t gap-x-xsmall">
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
