import { Button, DropdownMenu } from "@medusajs/ui"
import { ReactNode } from "react"
import { useSearchParams } from "react-router-dom"

type FilterGroupProps = {
  filters: {
    [key: string]: ReactNode
  }
}

export const FilterGroup = ({ filters }: FilterGroupProps) => {
  const [searchParams] = useSearchParams()
  const filterKeys = Object.keys(filters)

  if (filterKeys.length === 0) {
    return null
  }

  const isClearable = filterKeys.some((key) => searchParams.get(key))
  const hasMore = !filterKeys.every((key) => searchParams.get(key))
  const availableKeys = filterKeys.filter((key) => !searchParams.get(key))

  return (
    <div className="flex items-center flex-wrap gap-2">
      {hasMore && <AddFilterMenu availableKeys={availableKeys} />}
      {isClearable && (
        <Button variant="transparent" size="small">
          Clear all
        </Button>
      )}
    </div>
  )
}

type AddFilterMenuProps = {
  availableKeys: string[]
}

const AddFilterMenu = ({ availableKeys }: AddFilterMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button variant="secondary" size="small">
          Add filter
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {availableKeys.map((key) => (
          <DropdownMenu.Item key={key}>{key}</DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}
