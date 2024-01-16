import { EllipsisHorizontal, PencilSquare } from "@medusajs/icons"
import { Customer } from "@medusajs/medusa"
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
import { useAdminCustomers } from "medusa-react"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"
import { Query } from "../../../../../components/filtering/query"
import { LocalizedTablePagination } from "../../../../../components/localization/localized-table-pagination"
import { useQueryParams } from "../../../../../hooks/use-query-params"

const PAGE_SIZE = 50

export const CustomerListTable = () => {
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

  const { q } = useQueryParams(["q"])
  const { customers, count, isLoading, isError, error } = useAdminCustomers({
    q,
    limit: PAGE_SIZE,
    offset: pageIndex * PAGE_SIZE,
  })

  const columns = useColumns()

  const table = useReactTable({
    data: customers ?? [],
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
    <Container className="p-0 divide-y">
      <div className="px-6 py-4 flex items-center justify-between">
        <Heading>{t("customers.domain")}</Heading>
        <Link to="/customers/create">
          <Button size="small" variant="secondary">
            {t("general.create")}
          </Button>
        </Link>
      </div>
      <div className="px-6 py-4 flex items-center justify-between">
        <div></div>
        <div className="flex items-center gap-x-2">
          <Query />
        </div>
      </div>
      <div>
        <Table>
          <Table.Header className="border-t-0">
            {table.getHeaderGroups().map((headerGroup) => {
              return (
                <Table.Row
                  key={headerGroup.id}
                  className=" [&_th:last-of-type]:w-[1%] [&_th:last-of-type]:whitespace-nowrap [&_th]:w-1/3"
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
                onClick={() => navigate(`/customers/${row.original.id}`)}
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
          pageSize={PAGE_SIZE}
        />
      </div>
    </Container>
  )
}

const CustomerActions = ({ customer }: { customer: Customer }) => {
  const { t } = useTranslation()

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <IconButton size="small" variant="transparent">
          <EllipsisHorizontal />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <Link to={`/customers/${customer.id}/edit`}>
          <DropdownMenu.Item
            className="flex items-center gap-x-2"
            onClick={(e) => e.stopPropagation()}
          >
            <PencilSquare className="text-ui-fg-subtle" />
            {t("general.edit")}
          </DropdownMenu.Item>
        </Link>
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}

const columnHelper = createColumnHelper<Customer>()

const useColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.display({
        id: "name",
        header: t("fields.name"),
        cell: ({ row }) => {
          const firstName = row.original.first_name
          const lastName = row.original.last_name

          let value = "-"

          if (firstName && lastName) {
            value = `${firstName} ${lastName}`
          } else if (firstName) {
            value = firstName
          } else if (lastName) {
            value = lastName
          }

          return <span>{value}</span>
        },
      }),
      columnHelper.accessor("email", {
        header: t("fields.email"),
        cell: ({ getValue }) => <span>{getValue()}</span>,
      }),
      columnHelper.accessor("has_account", {
        header: t("fields.account"),
        cell: ({ getValue }) => {
          const hasAccount = getValue()

          return (
            <StatusBadge color={hasAccount ? "green" : "blue"}>
              {hasAccount ? t("customers.registered") : t("customers.guest")}
            </StatusBadge>
          )
        },
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => <CustomerActions customer={row.original} />,
      }),
    ],
    [t]
  )
}
