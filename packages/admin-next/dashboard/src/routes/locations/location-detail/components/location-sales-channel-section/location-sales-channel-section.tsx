import { EllipsisHorizontal, PencilSquare, Trash } from "@medusajs/icons"
import { SalesChannel } from "@medusajs/medusa"
import { StockLocationExpandedDTO } from "@medusajs/types"
import {
  Button,
  Container,
  DropdownMenu,
  Heading,
  IconButton,
  StatusBadge,
  Table,
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
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"
import { NoRecords } from "../../../../../components/common/empty-table-content/empty-table-content"

type LocationSalesChannelSectionProps = {
  location: StockLocationExpandedDTO
}

const PAGE_SIZE = 20

export const LocationSalesChannelSection = ({
  location,
}: LocationSalesChannelSectionProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

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

  const salesChannels = location.sales_channels
  const count = location.sales_channels?.length || 0
  const columns = useColumns()

  const table = useReactTable({
    data: salesChannels ?? [],
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

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Sales Channels</Heading>
        <Link to={"add-sales-channels"}>
          <Button size="small" variant="secondary">
            {t("locations.addSalesChannels")}
          </Button>
        </Link>
      </div>
      <div>
        {count ? (
          <Table>
            <Table.Header>
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
                    navigate(`/settings/sales-channels/${row.original.id}`)
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
        ) : (
          <NoRecords
            action={{
              label: t("locations.addSalesChannels"),
              to: "add-sales-channels",
            }}
          />
        )}
      </div>
    </Container>
  )
}

const SalesChannelActions = ({ id }: { id: string }) => {
  const { t } = useTranslation()

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <IconButton variant="transparent">
          <EllipsisHorizontal />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item className="gap-x-2">
          <PencilSquare className="text-ui-fg-subtle" />
          <span>{t("general.edit")}</span>
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item className="gap-x-2">
          <Trash className="text-ui-fg-subtle" />
          <span>{t("general.delete")}</span>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}

const columnHelper = createColumnHelper<SalesChannel>()

const useColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("name", {
        header: t("fields.name"),
        cell: ({ getValue }) => getValue(),
      }),
      columnHelper.accessor("description", {
        header: t("fields.description"),
        cell: ({ getValue }) => getValue(),
      }),
      columnHelper.accessor("is_disabled", {
        header: t("fields.status"),
        cell: ({ getValue }) => {
          const value = getValue()
          return (
            <div>
              <StatusBadge color={value ? "grey" : "green"}>
                {value ? t("general.disabled") : t("general.enabled")}
              </StatusBadge>
            </div>
          )
        },
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
          return <SalesChannelActions id={row.original.id} />
        },
      }),
    ],
    [t]
  )
}
