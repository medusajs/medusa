import { HttpTypes } from "@medusajs/types"
import { Button, Checkbox } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import {
  OnChangeFn,
  RowSelectionState,
  createColumnHelper,
} from "@tanstack/react-table"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { StackedDrawer } from "../../../../../components/modals/stacked-drawer"
import { StackedFocusModal } from "../../../../../components/modals/stacked-focus-modal"
import { DataTable } from "../../../../../components/table/data-table"
import { useCustomerGroups } from "../../../../../hooks/api/customer-groups"
import { useCustomerGroupTableColumns } from "../../../../../hooks/table/columns/use-customer-group-table-columns"
import { useCustomerGroupTableFilters } from "../../../../../hooks/table/filters/use-customer-group-table-filters"
import { useCustomerGroupTableQuery } from "../../../../../hooks/table/query/use-customer-group-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { PriceListCustomerGroup } from "../../schemas"

const PAGE_SIZE = 50
const PREFIX = "cg"

type PriceListCustomerGroupRuleFormProps = {
  type: "focus" | "drawer"
  state: PriceListCustomerGroup[]
  setState: (state: PriceListCustomerGroup[]) => void
}

const initRowSelection = (state: PriceListCustomerGroup[]) => {
  return state.reduce((acc, group) => {
    acc[group.id] = true
    return acc
  }, {} as RowSelectionState)
}

export const PriceListCustomerGroupRuleForm = ({
  state,
  setState,
  type,
}: PriceListCustomerGroupRuleFormProps) => {
  const { t } = useTranslation()

  const [rowSelection, setRowSelection] = useState<RowSelectionState>(
    initRowSelection(state)
  )
  const [intermediate, setIntermediate] =
    useState<PriceListCustomerGroup[]>(state)

  useEffect(() => {
    // If the selected customer groups change outside of the drawer,
    // update the row selection state and intermediate state
    setRowSelection(initRowSelection(state))
    setIntermediate(state)
  }, [state])

  const { searchParams, raw } = useCustomerGroupTableQuery({
    pageSize: PAGE_SIZE,
    prefix: PREFIX,
  })
  const { customer_groups, count, isLoading, isError, error } =
    useCustomerGroups(searchParams, {
      placeholderData: keepPreviousData,
    })

  const updater: OnChangeFn<RowSelectionState> = (value) => {
    const state = typeof value === "function" ? value(rowSelection) : value
    const currentIds = Object.keys(rowSelection)

    const ids = Object.keys(state)

    const newIds = ids.filter((id) => !currentIds.includes(id))
    const removedIds = currentIds.filter((id) => !ids.includes(id))

    const newCustomerGroups =
      customer_groups
        ?.filter((cg) => newIds.includes(cg.id))
        .map((cg) => ({ id: cg.id, name: cg.name! })) || []

    const filteredIntermediate = intermediate.filter(
      (cg) => !removedIds.includes(cg.id)
    )

    setIntermediate([...filteredIntermediate, ...newCustomerGroups])
    setRowSelection(state)
  }

  const handleSave = () => {
    setState(intermediate)
  }

  const filters = useCustomerGroupTableFilters()
  const columns = useColumns()

  const { table } = useDataTable({
    data: customer_groups || [],
    columns,
    count,
    enablePagination: true,
    enableRowSelection: true,
    getRowId: (row) => row.id,
    rowSelection: {
      state: rowSelection,
      updater,
    },
    pageSize: PAGE_SIZE,
    prefix: PREFIX,
  })

  const Component = type === "focus" ? StackedFocusModal : StackedDrawer

  if (isError) {
    throw error
  }

  return (
    <div className="flex size-full flex-col overflow-hidden">
      <Component.Body className="min-h-0 p-0">
        <DataTable
          table={table}
          columns={columns}
          pageSize={PAGE_SIZE}
          count={count}
          isLoading={isLoading}
          filters={filters}
          orderBy={["name", "created_at", "updated_at"]}
          layout="fill"
          pagination
          search
          prefix={PREFIX}
          queryObject={raw}
        />
      </Component.Body>
      <Component.Footer>
        <Component.Close asChild>
          <Button variant="secondary" size="small" type="button">
            {t("actions.cancel")}
          </Button>
        </Component.Close>
        <Button type="button" size="small" onClick={handleSave}>
          {t("actions.save")}
        </Button>
      </Component.Footer>
    </div>
  )
}

const columnHelper = createColumnHelper<HttpTypes.AdminCustomerGroup>()

const useColumns = () => {
  const base = useCustomerGroupTableColumns()

  return useMemo(
    () => [
      columnHelper.display({
        id: "select",
        header: ({ table }) => {
          return (
            <Checkbox
              checked={
                table.getIsSomePageRowsSelected()
                  ? "indeterminate"
                  : table.getIsAllPageRowsSelected()
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
            />
          )
        },
        cell: ({ row }) => {
          return (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              onClick={(e) => {
                e.stopPropagation()
              }}
            />
          )
        },
      }),
      ...base,
    ],
    [base]
  )
}
