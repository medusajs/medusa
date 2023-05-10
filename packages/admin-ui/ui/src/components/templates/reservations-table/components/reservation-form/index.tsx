import { InventoryItemDTO, StockLocationDTO } from "@medusajs/types"
import { NestedForm } from "../../../../../utils/nested-form"
import ItemSearch from "../../../../molecules/item-search"
import LocationDropdown from "../../../../molecules/location-dropdown"

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
    formState: { errors },
  } = form

  const onItemSelect = (item) => console.log({ item })

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
        <ItemSearch onItemSelect={onItemSelect} clearOnSelect={true} />
      </div>
    </div>
  )
}

export default ReservationForm
