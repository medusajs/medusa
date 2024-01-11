import { EllipsisHorizontal, PencilSquare, Trash } from "@medusajs/icons"
import { Region } from "@medusajs/medusa"
import {
  Button,
  Container,
  DropdownMenu,
  Heading,
  IconButton,
  Table,
  Tooltip,
  clx,
} from "@medusajs/ui"
import {
  PaginationState,
  RowSelectionState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useAdminRegions } from "medusa-react"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"

const PAGE_SIZE = 50

export const RegionListTable = () => {
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

  const { regions, count, isLoading, isError, error } = useAdminRegions({
    limit: PAGE_SIZE,
    offset: pageIndex * PAGE_SIZE,
  })

  const columns = useColumns()

  const table = useReactTable({
    data: regions ?? [],
    columns,
    pageCount: Math.ceil((count ?? 0) / PAGE_SIZE),
    state: {
      pagination,
      rowSelection,
    },
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  })

  if (isError) {
    throw error
  }

  return (
    <Container className="p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("regions.domain")}</Heading>
        <Link to="/settings/regions/create">
          <Button size="small" variant="secondary">
            {t("general.create")}
          </Button>
        </Link>
      </div>
      <Table>
        <Table.Header>
          {table.getHeaderGroups().map((headerGroup) => {
            return (
              <Table.Row
                key={headerGroup.id}
                className=" [&_th:last-of-type]:w-[1%] [&_th:last-of-type]:whitespace-nowrap"
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
              onClick={() => navigate(`/settings/regions/${row.original.id}`)}
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
      <Table.Pagination
        canNextPage={table.getCanNextPage()}
        canPreviousPage={table.getCanPreviousPage()}
        nextPage={table.nextPage}
        previousPage={table.previousPage}
        count={count ?? 0}
        pageIndex={pageIndex}
        pageCount={table.getPageCount()}
        pageSize={PAGE_SIZE}
      />
    </Container>
  )
}

const RegionActions = ({ region }: { region: Region }) => {
  const { t } = useTranslation()

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild onClick={(e) => e.stopPropagation()}>
        <IconButton variant="transparent">
          <EllipsisHorizontal />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <Link to={`/settings/regions/${region.id}/edit`}>
          <DropdownMenu.Item onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-x-2">
              <PencilSquare className="text-ui-fg-subtle" />
              <span>{t("general.edit")}</span>
            </div>
          </DropdownMenu.Item>
        </Link>
        <DropdownMenu.Separator />
        <DropdownMenu.Item onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-x-2">
            <Trash className="text-ui-fg-subtle" />
            <span>{t("general.delete")}</span>
          </div>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}

const columnHelper = createColumnHelper<Region>()

const useColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("name", {
        header: t("fields.name"),
        cell: (cell) => cell.getValue(),
      }),
      columnHelper.accessor("countries", {
        header: t("fields.countries"),
        cell: (cell) => {
          const countries = cell.getValue()

          const displayValue = countries
            .slice(0, 2)
            .map((c) => c.display_name)
            .join(", ")

          const additionalCountries = countries
            .slice(2)
            .map((c) => c.display_name)

          return (
            <div className="flex items-center gap-x-1">
              <span>{displayValue}</span>
              {additionalCountries.length > 0 && (
                <Tooltip
                  content={
                    <ul>
                      {additionalCountries.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  }
                >
                  <span>
                    {t("general.plusCountMore", {
                      count: additionalCountries.length,
                    })}
                  </span>
                </Tooltip>
              )}
            </div>
          )
        },
      }),
      columnHelper.accessor("payment_providers", {
        header: t("fields.paymentProviders"),
        cell: (cell) => {
          const providers = cell.getValue()

          const displayValue = providers
            .slice(0, 2)
            .map((p) => p.id)
            .join(", ")

          const additionalProviders = providers.slice(2).map((c) => c.id)

          return (
            <div className="flex items-center gap-x-1">
              <span>{displayValue}</span>
              {additionalProviders.length > 0 && (
                <Tooltip
                  content={
                    <ul>
                      {additionalProviders.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  }
                >
                  <span>
                    {t("general.plusCountMore", {
                      count: additionalProviders.length,
                    })}
                  </span>
                </Tooltip>
              )}
            </div>
          )
        },
      }),
      columnHelper.accessor("fulfillment_providers", {
        header: t("fields.fulfillmentProviders"),
        cell: (cell) => {
          const providers = cell.getValue()

          const displayValue = providers
            .slice(0, 2)
            .map((p) => p.id)
            .join(", ")

          const additionalProviders = providers.slice(2).map((c) => c.id)

          return (
            <div className="flex items-center gap-x-1">
              <span>{displayValue}</span>
              {additionalProviders.length > 0 && (
                <Tooltip
                  content={
                    <ul>
                      {additionalProviders.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  }
                >
                  <span>
                    {t("general.plusCountMore", {
                      count: additionalProviders.length,
                    })}
                  </span>
                </Tooltip>
              )}
            </div>
          )
        },
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
          return <RegionActions region={row.original} />
        },
      }),
    ],
    [t]
  )
}
