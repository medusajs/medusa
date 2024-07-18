import {
  AdminGetInventoryItemsParams,
  DecoratedInventoryItemDTO,
} from "@medusajs/medusa"
import { ControlProps, OptionProps, SingleValue } from "react-select"

import Control from "../select/next-select/components/control"
import { NextSelect } from "../select/next-select"
import SearchIcon from "../../fundamentals/icons/search-icon"
import { useAdminInventoryItems } from "medusa-react"
import { useDebounce } from "../../../hooks/use-debounce"
import { useState } from "react"

type Props = {
  onItemSelect: (item: DecoratedInventoryItemDTO) => void
  clearOnSelect?: boolean
  filters?: AdminGetInventoryItemsParams
}

type ItemOption = {
  label: string | undefined
  value: string | undefined
  inventoryItem: DecoratedInventoryItemDTO
}

const ItemSearch = ({ onItemSelect, clearOnSelect, filters = {} }: Props) => {
  const [itemSearchTerm, setItemSearchTerm] = useState<string | undefined>()

  const debouncedItemSearchTerm = useDebounce(itemSearchTerm, 500)

  const queryEnabled = !!debouncedItemSearchTerm?.length

  const { isLoading, inventory_items } = useAdminInventoryItems(
    {
      q: debouncedItemSearchTerm,
      ...filters,
    },
    { enabled: queryEnabled }
  )

  const onChange = (item: SingleValue<ItemOption>) => {
    if (item) {
      onItemSelect(item.inventoryItem)
    }
  }

  const options = inventory_items?.map(
    (inventoryItem: DecoratedInventoryItemDTO) => ({
      label:
        inventoryItem.title ||
        inventoryItem.variants?.[0]?.product?.title ||
        inventoryItem.sku,
      value: inventoryItem.id,
      inventoryItem,
    })
  ) as ItemOption[]

  const filterOptions = () => true

  return (
    <div>
      <NextSelect
        isMulti={false}
        components={{ Option: ProductOption, Control: SearchControl }}
        onInputChange={setItemSearchTerm}
        options={options}
        placeholder="Search by sku..."
        isSearchable={true}
        noOptionsMessage={() => "No items found"}
        openMenuOnClick={!!inventory_items?.length}
        onChange={onChange}
        value={null}
        isLoading={queryEnabled && isLoading}
        filterOption={filterOptions} // TODO: Remove this when we can q for inventory item titles
      />
    </div>
  )
}

const ProductOption = ({ innerProps, data }: OptionProps<ItemOption>) => {
  return (
    <div
      {...innerProps}
      className="text-small grid w-full cursor-pointer grid-cols-2 place-content-between px-4 py-2 transition-all hover:bg-gray-50"
    >
      <div>
        <p>{data.label}</p>
        <p className="text-grey-50">{data.inventoryItem.sku}</p>
      </div>
      <div className="text-end">
        <p className="text-grey-50">{`${data.inventoryItem.stocked_quantity} stock`}</p>
        <p className="text-grey-50">{`${
          data.inventoryItem.stocked_quantity -
          data.inventoryItem.reserved_quantity
        } available`}</p>
      </div>
    </div>
  )
}

const SearchControl = ({ children, ...props }: ControlProps<ItemOption>) => (
  <Control {...props}>
    <span className="me-4">
      <SearchIcon size={16} className="text-grey-50" />
    </span>
    {children}
  </Control>
)

export default ItemSearch
