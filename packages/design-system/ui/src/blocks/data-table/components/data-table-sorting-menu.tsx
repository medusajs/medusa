"use client"

import { useDataTableContext } from "@/blocks/data-table/context/use-data-table-context"
import {
  DataTableColumn,
  DataTableSortableColumnDefMeta,
} from "@/blocks/data-table/types"
import { DropdownMenu } from "@/components/dropdown-menu"
import { IconButton } from "@/components/icon-button"
import { Skeleton } from "@/components/skeleton"
import { Tooltip } from "@/components/tooltip"
import { ArrowDownMini, ArrowUpMini, DescendingSorting } from "@medusajs/icons"
import * as React from "react"

interface DataTableSortingMenuProps {
  /**
   * The tooltip to show when hovering over the sorting menu.
   */
  tooltip?: string
}

/**
 * This component adds a sorting menu to the data table, allowing users
 * to sort the table's data.
 */
const DataTableSortingMenu = (props: DataTableSortingMenuProps) => {
  const { instance } = useDataTableContext()

  const sortableColumns = instance
    .getAllColumns()
    .filter((column) => column.getCanSort())

  const sorting = instance.getSorting()

  const selectedColumn = React.useMemo(() => {
    return sortableColumns.find((column) => column.id === sorting?.id)
  }, [sortableColumns, sorting])

  const setKey = React.useCallback(
    (key: string) => {
      instance.setSorting((prev) => ({ id: key, desc: prev?.desc ?? false }))
    },
    [instance]
  )

  const setDesc = React.useCallback(
    (desc: string) => {
      instance.setSorting((prev) => ({
        id: prev?.id ?? "",
        desc: desc === "true",
      }))
    },
    [instance]
  )

  if (!instance.enableSorting) {
    throw new Error(
      "DataTable.SortingMenu was rendered but sorting is not enabled. Make sure to pass sorting to 'useDataTable'"
    )
  }

  if (!sortableColumns.length) {
    throw new Error(
      "DataTable.SortingMenu was rendered but there are no sortable columns. Make sure to set `enableSorting` to true on at least one column."
    )
  }

  if (instance.showSkeleton) {
    return <DataTableSortingMenuSkeleton />
  }

  const Wrapper = props.tooltip ? Tooltip : React.Fragment
  const wrapperProps = props.tooltip ? { content: props.tooltip } : ({} as any)

  return (
    <DropdownMenu>
      <Wrapper {...wrapperProps}>
        <DropdownMenu.Trigger asChild>
          <IconButton size="small">
            <DescendingSorting />
          </IconButton>
        </DropdownMenu.Trigger>
      </Wrapper>
      <DropdownMenu.Content side="bottom" className="overflow-y-auto">
        <DropdownMenu.RadioGroup value={sorting?.id} onValueChange={setKey}>
          {sortableColumns.map((column) => {
            return (
              <DropdownMenu.RadioItem
                onSelect={(e) => e.preventDefault()}
                value={column.id}
                key={column.id}
              >
                {getSortLabel(column)}
              </DropdownMenu.RadioItem>
            )
          })}
        </DropdownMenu.RadioGroup>
        {sorting && (
          <React.Fragment>
            <DropdownMenu.Separator />
            <DropdownMenu.RadioGroup
              value={sorting?.desc ? "true" : "false"}
              onValueChange={setDesc}
            >
              <DropdownMenu.RadioItem
                onSelect={(e) => e.preventDefault()}
                value="false"
                className="flex items-center gap-2"
              >
                <ArrowUpMini className="text-ui-fg-subtle" />
                {getSortDescriptor("asc", selectedColumn)}
              </DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem
                onSelect={(e) => e.preventDefault()}
                value="true"
                className="flex items-center gap-2"
              >
                <ArrowDownMini className="text-ui-fg-subtle" />
                {getSortDescriptor("desc", selectedColumn)}
              </DropdownMenu.RadioItem>
            </DropdownMenu.RadioGroup>
          </React.Fragment>
        )}
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}
DataTableSortingMenu.displayName = "DataTable.SortingMenu"

function getSortLabel(column: DataTableColumn<any, unknown>) {
  const meta = column.columnDef.meta as
    | DataTableSortableColumnDefMeta
    | undefined
  let headerValue: string | undefined = undefined

  if (typeof column.columnDef.header === "string") {
    headerValue = column.columnDef.header
  }

  return meta?.___sortMetaData?.sortLabel ?? headerValue ?? column.id
}

function getSortDescriptor(
  direction: "asc" | "desc",
  column?: DataTableColumn<any, unknown>
) {
  if (!column) {
    return null
  }

  const meta = column.columnDef.meta as
    | DataTableSortableColumnDefMeta
    | undefined

  switch (direction) {
    case "asc":
      return meta?.___sortMetaData?.sortAscLabel ?? "A-Z"
    case "desc":
      return meta?.___sortMetaData?.sortDescLabel ?? "Z-A"
  }
}

const DataTableSortingMenuSkeleton = () => {
  return <Skeleton className="size-7" />
}

export { DataTableSortingMenu }
export type { DataTableSortingMenuProps }
