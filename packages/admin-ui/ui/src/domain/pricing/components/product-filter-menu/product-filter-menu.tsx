import { DateComparisonOperator } from "@medusajs/types"
import { useTranslation } from "react-i18next"
import { FilterMenu } from "../../../../components/molecules/filter-menu"

type ProductFilter = {
  created_at?: DateComparisonOperator
  updated_at?: DateComparisonOperator
}

type ProductFilterMenuProps = {
  onClearFilters: () => void
  onFilterChange: (filter: ProductFilter) => void
  value?: ProductFilter
}

const ProductFilterMenu = ({
  value,
  onClearFilters,
  onFilterChange,
}: ProductFilterMenuProps) => {
  const { t } = useTranslation()

  const onDateChange = (
    key: "created_at" | "updated_at",
    date?: DateComparisonOperator
  ) => {
    onFilterChange({
      ...value,
      [key as keyof ProductFilter]: date,
    })
  }

  return (
    <FilterMenu onClearFilters={onClearFilters}>
      <FilterMenu.Content>
        <FilterMenu.DateItem
          name={t("price-list-product-filter-created-at", "Created at")}
          value={value?.created_at}
          onChange={(obj) => onDateChange("created_at", obj)}
        />
        <FilterMenu.Seperator />
        <FilterMenu.DateItem
          name={t("price-list-product-filter-updated-at", "Updated at")}
          value={value?.updated_at}
          onChange={(obj) => onDateChange("updated_at", obj)}
        />
      </FilterMenu.Content>
    </FilterMenu>
  )
}

export { ProductFilterMenu, type ProductFilter }
