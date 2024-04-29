import { AdminProductCategoryResponse } from "@medusajs/types"
import * as Popover from "@radix-ui/react-popover"
import { ComponentPropsWithoutRef, forwardRef, useState } from "react"
import { useCategories } from "../../../../../hooks/api/categories"
import { useDebouncedSearch } from "../../../../../hooks/use-debounced-search"

interface CategoryComboboxProps
  extends Omit<
    ComponentPropsWithoutRef<"input">,
    "value" | "defaultValue" | "onChange"
  > {
  value: string[]
  onChange: (value: string[]) => void
}

type Level = {
  id: string
  label: string
}

export const CategoryCombobox = forwardRef<
  HTMLInputElement,
  CategoryComboboxProps
>(({ value, onChange, ...props }, ref) => {
  const [level, setLevel] = useState<Level[]>([])

  const { searchValue, onSearchValueChange, query } = useDebouncedSearch()

  const { product_categories, isPending, isError, error } = useCategories({
    q: query,
    parent_id: getParentId(level),
  })

  function handleLevelUp() {
    setLevel(level.slice(0, level.length - 1))
  }

  function handleLevelDown(option: ProductCategoryOption) {
    setLevel([...level, { id: option.value, label: option.label }])
  }

  const options = getOptions(product_categories || [])

  if (isError) {
    throw error
  }

  return (
    <Popover.Root>
      <Popover.Anchor asChild>
        <div>
          <input
            ref={ref}
            value={searchValue}
            onChange={(e) => onSearchValueChange(e.target.value)}
          />
        </div>
      </Popover.Anchor>
      <Popover.Content>
        {options.map((option) => (
          <div key={option.value}>{option.label}</div>
        ))}
      </Popover.Content>
    </Popover.Root>
  )
})

CategoryCombobox.displayName = "CategoryCombobox"

type ProductCategoryOption = {
  value: string
  label: string
  has_children: boolean
}

function getParentId(level: Level[]): string {
  if (!level.length) {
    return "null"
  }

  return level[level.length - 1].id
}

function getParentLabel(level: Level[]): string | null {
  if (!level.length) {
    return null
  }

  return level[level.length - 1].label
}

function getOptions(
  categories: AdminProductCategoryResponse["product_category"][]
): ProductCategoryOption[] {
  return categories.map((cat) => {
    return {
      value: cat.id,
      label: cat.name,
      has_children: cat.category_children?.length > 0,
    }
  })
}
