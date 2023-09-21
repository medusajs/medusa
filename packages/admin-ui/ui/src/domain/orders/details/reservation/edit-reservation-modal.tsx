import { Controller, useForm, useWatch } from "react-hook-form"
import {
  InventoryLevelDTO,
  ReservationItemDTO,
  StockLocationDTO,
} from "@medusajs/types"
import MetadataForm, {
  getMetadataFormValues,
  getSubmittableMetadata,
  MetadataFormType,
} from "../../../../components/forms/general/metadata-form"
import {
  useAdminDeleteReservation,
  useAdminInventoryItem,
  useAdminStockLocations,
  useAdminUpdateReservation,
} from "medusa-react"
import { useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"

import Button from "../../../../components/fundamentals/button"
import CrossIcon from "../../../../components/fundamentals/icons/cross-icon"
import InputField from "../../../../components/molecules/input"
import { LineItem } from "@medusajs/medusa"
import { ReserveLineItemForm } from "./reserve-items-modal"
import Select from "../../../../components/molecules/select/next-select/select"
import SideModal from "../../../../components/molecules/modal/side-modal"
import Thumbnail from "../../../../components/atoms/thumbnail"
import { getFulfillableQuantity } from "../create-fulfillment/item-table"
import { nestedForm } from "../../../../utils/nested-form"
import useNotification from "../../../../hooks/use-notification"
import useToggleState from "../../../../hooks/use-toggle-state"

type EditReservationLineItemForm = {
  location: { label: string; value: string }
  item: ReserveLineItemForm
  metadata: MetadataFormType
}

const EditReservationDrawer = ({
  close,
  reservation,
  item,
  totalReservedQuantity = 0,
}: {
  close: () => void
  reservation: ReservationItemDTO
  item?: LineItem
  totalReservedQuantity?: number
}) => {
  const { t } = useTranslation()
  const form = useForm<EditReservationLineItemForm>({
    defaultValues: {
      item: {
        description: reservation.description,
      },
      metadata: getMetadataFormValues(reservation?.metadata),
    },
  })

  const { state: hasMetadata, toggle: toggleHasMetadata } = useToggleState(
    !!reservation.metadata
  )

  const { control, setValue, handleSubmit, register } = form

  const { stock_locations, isLoading: isLoadingStockLocations } =
    useAdminStockLocations()

  const { inventory_item, isLoading } = useAdminInventoryItem(
    reservation.inventory_item_id
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

    return stock_locations.map((sl: StockLocationDTO) => ({
      value: sl.id,
      label: sl.name,
    }))
  }, [isLoadingStockLocations, stock_locations])

  const notification = useNotification()
  const handleDelete = () => {
    deleteReservation(undefined, {
      onSuccess: () => {
        notification(
          t("reservation-reservation-was-deleted", "Reservation was deleted"),
          t(
            "reservation-the-allocated-items-have-been-released",
            "The allocated items have been released."
          ),
          "success"
        )
        close()
      },
      onError: () => {
        notification(
          t("reservation-error", "Error"),
          t(
            "reservation-failed-to-delete-the-reservation",
            "Failed to delete the reservation "
          ),
          "error"
        )
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
        (sl: StockLocationDTO) => sl.id === reservation.location_id
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

  const submit = (data: EditReservationLineItemForm) => {
    if (!data.item.quantity) {
      return handleDelete()
    }

    updateReservation(
      {
        quantity: data.item.quantity,
        location_id: data.location.value,
        description: data.item.description,
        metadata: hasMetadata
          ? getSubmittableMetadata(data.metadata)
          : undefined,
      },
      {
        onSuccess: () => {
          notification(
            t("reservation-reservation-was-updated", "Reservation was updated"),
            t(
              "reservation-the-reservation-change-was-saved",
              "The reservation change was saved."
            ),
            "success"
          )
          close()
        },
        onError: () => {
          notification(
            t("reservation-errors", "Errors"),
            t(
              "reservation-failed-to-update-reservation",
              "Failed to update reservation"
            ),
            "error"
          )
        },
      }
    )
  }

  const { availableQuantity, inStockQuantity } = useMemo(() => {
    if (isLoading || !selectedLocation?.value || !inventory_item) {
      return {}
    }

    const locationInventory = inventory_item.location_levels?.find(
      (inv: InventoryLevelDTO) => inv.location_id === selectedLocation?.value
    )
    if (!locationInventory) {
      return {}
    }
    return {
      availableQuantity: locationInventory.available_quantity,
      inStockQuantity: locationInventory.stocked_quantity,
    }
  }, [isLoading, selectedLocation?.value, inventory_item])

  const maxReservation = useMemo(() => {
    if (!item) {
      return typeof availableQuantity === "number"
        ? availableQuantity + reservation.quantity
        : reservation.quantity
    }

    const lineItemReservationCapacity =
      getFulfillableQuantity(item) -
      (totalReservedQuantity - (reservation?.quantity || 0))

    const inventoryItemReservationCapacity =
      typeof availableQuantity === "number" ? availableQuantity : 0

    return Math.min(
      lineItemReservationCapacity,
      inventoryItemReservationCapacity
    )
  }, [availableQuantity, item, reservation?.quantity, totalReservedQuantity])

  const closeModal = (e) => {
    e.preventDefault()
    close()
  }

  return (
    <SideModal isVisible close={close}>
      <form
        className="text-grey-90 h-full w-full"
        onSubmit={handleSubmit(submit)}
      >
        <div className="flex h-full flex-col justify-between">
          <div className="border-grey-20 flex items-center justify-between border-b px-8 py-6">
            <h1 className="inter-large-semibold ">
              {t("reservation-edit-reservation", "Edit Reservation")}
            </h1>
            <Button
              variant="ghost"
              className="p-1.5"
              type="button"
              onClick={closeModal}
            >
              <CrossIcon />
            </Button>
          </div>
          <div className="flex grow flex-col overflow-y-auto">
            <div className="flex h-full flex-col justify-between gap-y-8 px-8 pb-8 pt-6">
              <div className="flex flex-col gap-y-6">
                <div>
                  <h2 className="inter-base-semibold">
                    {t("reservation-location", "Location")}
                  </h2>
                  <span className="inter-base-regular text-grey-50">
                    {t(
                      "reservation-choose-which-location-you-want-to-ship-the-items-from",
                      "Choose which location you want to ship the items from."
                    )}
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
                </div>

                <div>
                  <h2 className="inter-base-semibold">
                    {t(
                      "reservation-items-to-allocate-title",
                      "Items to Allocate"
                    )}
                  </h2>
                  <span className="inter-base-regular text-grey-50">
                    {t(
                      "reservation-select-the-number-of-items-that-you-wish-to-allocate",
                      "Select the number of items that you wish to allocate."
                    )}
                  </span>
                  <div
                    className={`
                  bg-grey-5 text-grey-50 border-grey-20 
                  inter-base-regular
                  mt-6
                  grid border-collapse grid-cols-2 grid-rows-3 
                  [&>*]:border-r [&>*]:border-b [&>*]:py-2 
                  [&>*:nth-child(odd)]:border-l [&>*:nth-child(odd)]:pl-4 
                  [&>*:nth-child(even)]:pr-4 [&>*:nth-child(even)]:text-right 
                  [&>*:nth-child(-n+2)]:border-t`}
                  >
                    <div className="rounded-tl-rounded">Item</div>
                    <div className="rounded-tr-rounded flex justify-end space-x-3">
                      <p className="inter-base-regular text-grey-50 truncate ">
                        {inventory_item?.title ?? item?.title ?? "-"}
                      </p>
                      <Thumbnail
                        size="xsmall"
                        src={inventory_item?.thumbnail ?? item?.thumbnail}
                      />
                    </div>
                    <div>SKU</div>
                    <div>{inventory_item?.sku ?? "N/A"}</div>
                    <div>In stock</div>
                    <div>{inStockQuantity ?? "N/A"}</div>
                    <div>Available</div>
                    <div>{availableQuantity ?? "N/A"}</div>
                    <div className="rounded-bl-rounded">Allocate</div>
                    <div className="bg-grey-0 rounded-br-rounded text-grey-80 flex items-center">
                      <input
                        className="remove-number-spinner inter-base-regular w-full shrink border-none bg-transparent text-right font-normal outline-none outline-0"
                        {...register("item.quantity", {
                          valueAsNumber: true,
                        })}
                        type="number"
                        min={0}
                        max={maxReservation}
                      />
                      <span className="text-grey-50 nowrap whitespace-nowrap pl-2">
                        {maxReservation
                          ? t(
                              "reservation-max-reservation-requested",
                              " / {{maxReservation}} requested",
                              {
                                maxReservation,
                              }
                            )
                          : t("reservation-reserved", " reserved")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="border-grey-20 inter-base-regular border-t pt-6">
                  <p className="inter-base-semibold">
                    {t("reservation-description", "Description")}
                  </p>
                  <p className="text-grey-50 mb-6">
                    {t(
                      "reservation-what-type-of-reservation-is-this",
                      "What type of reservation is this?"
                    )}
                  </p>
                  <InputField
                    {...register("item.description")}
                    placeholder={t("reservation-description", "Description")}
                  />
                </div>
                <div className="border-grey border-grey-20 w-full items-center border-t pt-6">
                  <div className="mb-2 flex justify-between">
                    <p className="inter-base-semibold ">
                      {t("reservation-metadata", "Metadata")}
                    </p>
                    <Button
                      size="small"
                      variant="ghost"
                      type="button"
                      className="border"
                      onClick={toggleHasMetadata}
                    >
                      {hasMetadata
                        ? t("reservation-remove-metadata", "Remove metadata")
                        : t("reservation-add-metadata", "Add metadata")}
                    </Button>
                  </div>
                  {hasMetadata && (
                    <MetadataForm form={nestedForm(form, "metadata")} />
                  )}
                </div>
              </div>

              <Button
                variant="ghost"
                className="my-1 w-full border text-rose-50"
                size="small"
                onClick={handleDelete}
                type="button"
              >
                {t("reservation-delete-reservation", "Delete reservation")}
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
              {t("reservation-cancel", "Cancel")}
            </Button>
            <Button variant="primary" size="small" type="submit">
              {t("reservation-save-and-close", "Save and close")}
            </Button>
          </div>
        </div>
      </form>
    </SideModal>
  )
}

export default EditReservationDrawer
