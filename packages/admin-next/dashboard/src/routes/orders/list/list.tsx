import { EllipsisHorizontal } from "@medusajs/icons"
import { Order } from "@medusajs/medusa"
import { Checkbox, Container, Heading, Tooltip } from "@medusajs/ui"
import { createColumnHelper } from "@tanstack/react-table"
import { useAdminOrders, useAdminRegions } from "medusa-react"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { DataTable } from "../../../components/data-table/data-table"
import { useDataTable } from "../../../hooks/use-data-table"
import { useQueryParams } from "../../../hooks/use-query-params"

export const OrderList = () => {
  const { regions } = useAdminRegions({
    limit: 1000,
    fields: "id,name",
    expand: "",
  })

  const { q, offset } = useQueryParams(["offset", "q"])
  const { orders, count, isLoading, isError, error } = useAdminOrders(
    {
      limit: 10,
      offset: offset ? Number(offset) : 0,
      q,
    },
    {
      keepPreviousData: true,
    }
  )

  const columns = useColumns()
  const { table } = useDataTable({
    data: orders ?? [],
    columns,
    enablePagination: true,
    count,
    pageSize: 10,
  })

  return (
    <div>
      <Container className="p-0 divide-y">
        <div className="px-6 py-4 flex items-center">
          <Heading>Orders</Heading>
        </div>
        <DataTable
          table={table}
          columns={columns}
          navigateTo={({ row }) => `/orders/${row.original.id}`}
          filters={[
            {
              key: "region",
              label: "Region",
              type: "select",
              options:
                regions?.map((r) => ({
                  label: r.name,
                  value: r.id,
                })) ?? [],
              multiple: true,
            },
          ]}
          searchable
          pagination
          commands={[
            {
              label: "Export",
              action: (selection) => {
                console.log(selection)
              },
              shortcut: "e",
            },
          ]}
          count={count}
        />
      </Container>
    </div>
  )
}

const columnHelper = createColumnHelper<Order>()

const useColumns = () => {
  const { t } = useTranslation()

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
          const isPreSelected = !row.getCanSelect()
          const isSelected = row.getIsSelected() || isPreSelected

          const Component = (
            <Checkbox
              checked={isSelected}
              disabled={isPreSelected}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              onClick={(e) => {
                e.stopPropagation()
              }}
            />
          )

          if (isPreSelected) {
            return (
              <Tooltip content={t("store.currencyAlreadyAdded")} side="right">
                {Component}
              </Tooltip>
            )
          }

          return Component
        },
      }),
      columnHelper.accessor("display_id", {
        header: "Order",
        cell: ({ getValue }) => getValue(),
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
          return <EllipsisHorizontal />
        },
      }),
    ],
    [t]
  )
}
