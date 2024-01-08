import { MagnifyingGlass } from "@medusajs/icons"
import { IconButton } from "@medusajs/ui"
import { useSearch } from "../../../providers/search-provider"

export const SearchToggle = () => {
  const { toggleSearch } = useSearch()

  return (
    <IconButton
      variant="transparent"
      onClick={toggleSearch}
      className="text-ui-fg-muted hover:text-ui-fg-subtle h-7 w-7 p-0"
    >
      <MagnifyingGlass />
    </IconButton>
  )
}
