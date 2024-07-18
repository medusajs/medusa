import Button from "../../../../fundamentals/button"
import { Controller } from "react-hook-form"
import { DecoratedInventoryItemDTO } from "@medusajs/medusa"
import { useTranslation } from "react-i18next"
import InputField from "../../../../molecules/input"
import ItemSearch from "../../../../molecules/item-search"
import LocationDropdown from "../../../../molecules/location-dropdown"
import { NestedForm } from "../../../../../utils/nested-form"
import React from "react"

export type GeneralFormType = {
  location: string | undefined
  item: Partial<DecoratedInventoryItemDTO> | undefined
  description: string | undefined
  quantity: number
}

type Props = {
  form: NestedForm<GeneralFormType>
}

const ReservationForm: React.FC<Props> = ({ form }) => {
  const { t } = useTranslation()
  const { register, path, watch, control, setValue } = form

  const locationId = watch(path("location"))

  const selectedItem = watch(path("item"))
  const [selectedLocation, setSelectedLocation] = React.useState<
    string | undefined
  >(locationId)

  const locationLevel = selectedItem?.location_levels?.find(
    (l) => l.location_id === selectedLocation
  )

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="grid w-full grid-cols-2 items-center">
        <div>
          <p className="inter-base-semibold mb-1">
            {t("reservation-form-location", "Location")}
          </p>
          <p className="text-grey-50">
            {t(
              "reservation-form-choose-where-you-wish-to-reserve-from",
              "Choose where you wish to reserve from."
            )}
          </p>
        </div>
        <Controller
          control={control}
          name={path("location")}
          render={({ field: { onChange } }) => {
            return (
              <LocationDropdown
                onChange={(v) => {
                  onChange(v)
                  setSelectedLocation(v)
                }}
                selectedLocation={selectedLocation}
              />
            )
          }}
        />
      </div>
      <div className="grid w-full grid-cols-2 items-center">
        <div>
          <p className="inter-base-semibold mb-1">
            {t("reservation-form-item-to-reserve", "Item to reserve")}
          </p>
          <p className="text-grey-50">
            {t(
              "reservation-form-select-the-item-that-you-wish-to-reserve",
              "Select the item that you wish to reserve."
            )}
          </p>
        </div>
        <Controller
          control={control}
          name={path("item")}
          render={({ field: { onChange } }) => {
            return (
              <ItemSearch
                onItemSelect={onChange}
                clearOnSelect={true}
                filters={{ location_id: selectedLocation }}
              />
            )
          }}
        />
        {selectedItem && locationLevel && (
          <div className="col-span-2 flex w-full flex-col">
            <div
              className={`
            bg-grey-5 text-grey-50 border-grey-20 
            mt-8
            grid border-collapse grid-cols-2 grid-rows-5 
            [&>*:nth-child(-n+2)]:border-t [&>*:nth-child(even)]:pe-4 [&>*:nth-child(even)]:text-end 
            [&>*:nth-child(odd)]:border-l [&>*:nth-child(odd)]:ps-4 
            [&>*]:border-b [&>*]:border-r 
            [&>*]:py-2`}
            >
              <div className="rounded-tl-rounded">
                {t("reservation-form-item", "Item")}
              </div>
              <div className="rounded-tr-rounded">
                {selectedItem!.title ?? "N/A"}
              </div>
              <div>SKU</div>
              <div>{selectedItem.sku ?? "N/A"}</div>
              <div>{t("reservation-form-in-stock", "In stock")}</div>
              <div>{locationLevel?.stocked_quantity}</div>
              <div>{t("reservation-form-available", "Available")}</div>
              <div>
                {locationLevel?.stocked_quantity -
                  locationLevel?.reserved_quantity}
              </div>
              <div className="rounded-bl-rounded">
                {t("reservation-form-reserve", "Reserve")}
              </div>
              <div className="bg-grey-0 rounded-br-rounded text-grey-80 flex items-center">
                <input
                  className="remove-number-spinner inter-base-regular w-full shrink border-none bg-transparent text-end font-normal outline-none outline-0"
                  {...register(path("quantity"), {
                    valueAsNumber: true,
                  })}
                  type="number"
                  min={0}
                  max={
                    locationLevel?.stocked_quantity -
                    locationLevel?.reserved_quantity
                  }
                />
              </div>
            </div>
            <div className="mt-4 flex w-full justify-end">
              <Button
                variant="ghost"
                className="border"
                size="small"
                type="button"
                onClick={() => setValue(path("item"), undefined)}
              >
                {t("reservation-form-remove-item", "Remove item")}
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="border-grey border-grey-20 grid w-full grid-cols-2 items-center border-t py-6">
        <div>
          <p className="inter-base-semibold mb-1">
            {t("reservation-form-description", "Description")}
          </p>
          <p className="text-grey-50">
            {t(
              "reservation-form-what-type-of-reservation-is-this",
              "What type of reservation is this?"
            )}
          </p>
        </div>
        <InputField
          {...register(path("description"))}
          placeholder={t("reservation-form-description", "Description")}
        />
      </div>
    </div>
  )
}

export default ReservationForm
