import { PencilSquare, Trash } from "@medusajs/icons"
import { StockLocationExpandedDTO } from "@medusajs/types"
import { Button, Container, Heading, Table, clx, usePrompt } from "@medusajs/ui"
import {
  PaginationState,
  RowSelectionState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  useAdminDeleteStockLocation,
  useAdminStockLocations,
} from "medusa-react"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate, useSearchParams } from "react-router-dom"

import { ActionMenu } from "../../../../../components/common/action-menu"
import {
  NoRecords,
  NoResults,
} from "../../../../../components/common/empty-table-content/empty-table-content"
import { LocalizedTablePagination } from "../../../../../components/localization/localized-table-pagination"

const PAGE_SIZE = 50

export const LocationsListTable = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  })

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  )

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const { stock_locations, count, isLoading, isError, error } =
    useAdminStockLocations({
      limit: PAGE_SIZE,
      offset: pageIndex * PAGE_SIZE,
      expand: "address",
    })

  const columns = useColumns()

  const table = useReactTable({
    data: stock_locations ?? [],
    columns,
    pageCount: Math.ceil((count ?? 0) / PAGE_SIZE),
    state: {
      pagination,
      rowSelection,
    },
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    if (error) {
      throw error
    }
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Locations</Heading>
        <div>
          <Link to="create">
            <Button size="small" variant="secondary">
              {t("actions.create")}
            </Button>
          </Link>
        </div>
      </div>
      {(stock_locations?.length ?? 0) > 0 ? (
        <div>
          <Table>
            <Table.Header className="border-t-0">
              {table.getHeaderGroups().map((headerGroup) => {
                return (
                  <Table.Row
                    key={headerGroup.id}
                    className="[&_th:last-of-type]:w-[1%] [&_th:last-of-type]:whitespace-nowrap [&_th]:w-1/3"
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
                    "transition-fg cursor-pointer [&_td:last-of-type]:w-[1%] [&_td:last-of-type]:whitespace-nowrap",
                    {
                      "bg-ui-bg-highlight hover:bg-ui-bg-highlight-hover":
                        row.getIsSelected(),
                    }
                  )}
                  onClick={() =>
                    navigate(`/settings/locations/${row.original.id}`)
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <Table.Cell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
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
            pageSize={PAGE_SIZE}
          />
        </div>
      ) : (
        <NoLocations />
      )}
    </Container>
  )
}

const LocationActions = ({
  location,
}: {
  location: StockLocationExpandedDTO
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const { mutateAsync } = useAdminDeleteStockLocation(location.id)

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("locations.deleteLocationWarning", {
        name: location.name,
      }),
      verificationText: location.name,
      verificationInstruction: t("general.typeToConfirm"),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync()
  }

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: <PencilSquare />,
              label: t("actions.edit"),
              to: `/settings/locations/${location.id}/edit`,
            },
            {
              icon: <Trash />,
              label: t("actions.delete"),
              onClick: handleDelete,
            },
          ],
        },
      ]}
    />
  )
}

const columnHelper = createColumnHelper<StockLocationExpandedDTO>()

const useColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("name", {
        header: t("fields.name"),
        cell: (cell) => cell.getValue(),
      }),
      columnHelper.accessor("address", {
        header: t("fields.address"),
        cell: (cell) => {
          const value = cell.getValue()

          if (!value) {
            return "-"
          }

          return `${value.address_1}${value.city ? `, ${value.city}` : ""}`
        },
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => <LocationActions location={row.original} />,
      }),
    ],
    [t]
  )
}

const NoLocations = () => {
  const [params] = useSearchParams()
  const { t } = useTranslation()

  const noParams = params.toString().length === 0

  if (noParams) {
    return (
      <NoRecords
        action={{
          label: t("locations.createLocation"),
          to: "/settings/locations/create",
        }}
      />
    )
  }

  return <NoResults title={t("locations.noLocationsFound")} />
}
