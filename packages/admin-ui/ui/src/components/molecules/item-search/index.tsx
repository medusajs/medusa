import { useState } from "react"
import { NextSelect } from "../select/next-select"
import { useAdminProducts } from "medusa-react"
import { useDebounce } from "../../../hooks/use-debounce"
import { OptionProps, ControlProps, SingleValue } from "react-select"
import { AdminGetProductsParams, Product } from "@medusajs/medusa"
import SearchIcon from "../../fundamentals/icons/search-icon"
import Control from "../select/next-select/components/control"
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing" // TODO: Fix this

type Props = {
  onItemSelect: (item: Product | PricedProduct) => void
  clearOnSelect?: boolean
  filters?: AdminGetProductsParams
}

type ItemOption = {
  label: string | undefined
  value: string | undefined
  product: Product | PricedProduct
}

const ItemSearch = ({ onItemSelect, clearOnSelect, filters = {} }: Props) => {
  const [itemSearchTerm, setItemSearchTerm] = useState<string | undefined>()

  const debouncedItemSearchTerm = useDebounce(itemSearchTerm, 500)

  const queryEnabled = !!debouncedItemSearchTerm?.length

  // TODO: change to inventory items
  const { isLoading, products } = useAdminProducts(
    {
      q: debouncedItemSearchTerm,
      ...filters,
    },
    { enabled: queryEnabled }
  )

  const onChange = (item: SingleValue<ItemOption>) => {
    if (item) {
      onItemSelect(item.product)
    }
  }

  return (
    <div>
      <NextSelect
        isMulti={false}
        components={{ Option: ProductOption, Control: SearchControl }}
        onInputChange={setItemSearchTerm}
        options={products?.map((product) => ({
          label: product.title,
          value: product.id,
          product,
        }))}
        placeholder="Choose an item"
        isSearchable={true}
        noOptionsMessage={() => "No items found"}
        openMenuOnClick={!!products?.length}
        onChange={onChange}
        {...(clearOnSelect ? { value: null } : {})}
        isLoading={queryEnabled && isLoading}
      />
    </div>
  )
}

const ProductOption = ({
  innerProps,
  isDisabled,
  data,
}: OptionProps<ItemOption>) => {
  if (isDisabled) {
    return null
  }
  return (
    <div
      {...innerProps}
      className="text-small grid w-full cursor-pointer grid-cols-2 place-content-between px-4 py-2 transition-all hover:bg-gray-50"
    >
      <div>
        <p>{data.label}</p>
        <p className="text-grey-50">SKU</p>
      </div>
      <div className="text-right">
        <p className="text-grey-50">72 stock</p>
        <p className="text-grey-50">x available</p>
      </div>
    </div>
  )
}

const SearchControl = ({ children, ...props }: ControlProps<ItemOption>) => (
  <Control {...props}>
    <span className="mr-4">
      <SearchIcon size={16} className="text-grey-50" />
    </span>
    {children}
  </Control>
)

export default ItemSearch
