import { EllipsisHorizontal } from "@medusajs/icons"
import { DropdownMenu, IconButton } from "@medusajs/ui"
import React from "react"

type SortingState = "asc" | "desc" | "alpha" | "alpha-reverse" | "none"

export default function DropdownMenuSorting() {
  const [sort, setSort] = React.useState<SortingState>("none")

  return (
    <div className="flex flex-col items-center gap-y-2">
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <IconButton>
            <EllipsisHorizontal />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="w-[300px]">
          <DropdownMenu.RadioGroup
            value={sort}
            onValueChange={(v) => setSort(v as SortingState)}
          >
            <DropdownMenu.RadioItem value="none">
              No Sorting
            </DropdownMenu.RadioItem>
            <DropdownMenu.Separator />
            <DropdownMenu.RadioItem value="alpha">
              Alphabetical
              <DropdownMenu.Hint>A-Z</DropdownMenu.Hint>
            </DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="alpha-reverse">
              Reverse Alphabetical
              <DropdownMenu.Hint>Z-A</DropdownMenu.Hint>
            </DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="asc">
              Created At - Ascending
              <DropdownMenu.Hint>1 - 30</DropdownMenu.Hint>
            </DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="desc">
              Created At - Descending
              <DropdownMenu.Hint>30 - 1</DropdownMenu.Hint>
            </DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu>
      <div>
        <pre className=" text-sm">Sorting: {sort}</pre>
      </div>
    </div>
  )
}
