import { Region, ShippingOption } from "@medusajs/medusa"
import { Container, Heading, StatusBadge, Table, clx } from "@medusajs/ui"
import {
  PaginationState,
  RowSelectionState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useAdminShippingOptions } from "medusa-react"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { LocalizedTablePagination } from "../../../../../components/localization/localized-table-pagination"

type RegionShippingOptionSectionProps = {
  region: Region
}

export const RegionShippingOptionSection = ({
  region,
}: RegionShippingOptionSectionProps) => {
  const { shipping_options, count, isError, error, isLoading } =
    useAdminShippingOptions({
      region_id: region.id,
      is_return: false,
    })

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: count || 0,
  })

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  )

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const columns = useShippingOptionColumns()

  const table = useReactTable({
    data: shipping_options ?? [],
    columns,
    pageCount: count ? 1 : 0,
    state: {
      pagination,
      rowSelection,
    },
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
  })

  const { t } = useTranslation()

  if (isError) {
    throw error
  }

  return (
    <Container className="p-0 divide-y">
      <div className="px-6 py-4">
        <Heading level="h2">{t("regions.shippingOptions")}</Heading>
      </div>
      <Table>
        <Table.Header>
          {table.getHeaderGroups().map((headerGroup) => {
            return (
              <Table.Row
                key={headerGroup.id}
                className="[&_th:first-of-type]:w-[1%] [&_th:first-of-type]:whitespace-nowrap [&_th:last-of-type]:w-[1%] [&_th:last-of-type]:whitespace-nowrap"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <Table.HeaderCell key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </Table.HeaderCell>
                  )
                })}
              </Table.Row>
            )
          })}
        </Table.Header>
        <Table.Body className="border-b-0">
          {table.getRowModel().rows.map((row) => (
            <Table.Row
              key={row.id}
              className={clx(
                "transition-fg [&_td:last-of-type]:w-[1%] [&_td:last-of-type]:whitespace-nowrap",
                {
                  "bg-ui-bg-highlight hover:bg-ui-bg-highlight-hover":
                    row.getIsSelected(),
                }
              )}
            >
              {row.getVisibleCells().map((cell) => (
                <Table.Cell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <LocalizedTablePagination
        canNextPage={table.getCanNextPage()}
        canPreviousPage={table.getCanPreviousPage()}
        nextPage={table.nextPage}
        previousPage={table.previousPage}
        count={count ?? 0}
        pageIndex={pageIndex}
        pageCount={table.getPageCount()}
        pageSize={count ?? 0}
      />
    </Container>
  )
}

const columnHelper = createColumnHelper<ShippingOption>()

const useShippingOptionColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("name", {
        header: t("fields.name"),
        cell: (cell) => cell.getValue(),
      }),
      columnHelper.accessor("admin_only", {
        header: t("fields.availability"),
        cell: (cell) => {
          const value = cell.getValue()

          return (
            <StatusBadge color={value ? "blue" : "green"}>
              {value ? t("general.admin") : t("general.store")}
            </StatusBadge>
          )
        },
      }),
    ],
    [t]
  )
}
