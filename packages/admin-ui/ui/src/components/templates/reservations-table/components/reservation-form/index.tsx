import { InventoryItemDTO, StockLocationDTO } from "@medusajs/types"

import { Controller } from "react-hook-form"
import ItemSearch from "../../../../molecules/item-search"
import LocationDropdown from "../../../../molecules/location-dropdown"
import { NestedForm } from "../../../../../utils/nested-form"
import { useAdminInventoryItemLocationLevels } from "medusa-react"

export type GeneralFormType = {
  location: StockLocationDTO
  item: InventoryItemDTO
  description: string
}

type Props = {
  form: NestedForm<GeneralFormType>
}

const ReservationForm = ({ form }: Props) => {
  const {
    register,
    path,
    watch,
    control,
    formState: { errors },
  } = form

  const selectedItem = watch(path("item"))

  const {inventory_level} = useAdminInventoryItemLocationLevels(selectedItem.id, {
    
  })
  console.log(selectedItem)

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="grid w-full grid-cols-2 items-center">
        <div>
          <p className="mb-1 font-semibold">Location</p>
          <p className="text-grey-50">Choose where you wish to reserve from.</p>
        </div>
        <LocationDropdown onChange={(location) => console.log({ location })} />
      </div>
      <div className="grid w-full grid-cols-2 items-center">
        <div>
          <p className="mb-1 font-semibold">Item to reserve</p>
          <p className="text-grey-50">
            Select the item that you wish to reserve.
          </p>
        </div>
        <Controller
          control={control}
          name={path("item")}
          render={({ field: { onChange } }) => {
            return <ItemSearch onItemSelect={onChange} clearOnSelect={true} />
          }}
        />
        {selectedItem && (
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
            <div className="rounded-tr-rounded">{selectedItem. ?? "N/A"}</div>
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
        )}
      </div>
    </div>
  )
}

export default ReservationForm
