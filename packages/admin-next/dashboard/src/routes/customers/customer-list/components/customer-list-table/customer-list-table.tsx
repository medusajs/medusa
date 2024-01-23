import { PencilSquare } from "@medusajs/icons"
import { Customer } from "@medusajs/medusa"
import {
  Button,
  Container,
  Heading,
  StatusBadge,
  Table,
  clx,
} from "@medusajs/ui"
import {
  PaginationState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useAdminCustomers } from "medusa-react"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { NoRecords } from "../../../../../components/common/empty-table-content"
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

  const params = useQueryParams(["q"])
  const { customers, count, isLoading, isError, error } = useAdminCustomers({
    limit: PAGE_SIZE,
    offset: pageIndex * PAGE_SIZE,
    ...params,
  })

  const columns = useColumns()

  const table = useReactTable({
    data: customers ?? [],
    columns,
    pageCount: Math.ceil((count ?? 0) / PAGE_SIZE),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  })

  const noRecords =
    !isLoading &&
    (!customers || customers.length === 0) &&
    !Object.values(params).filter(Boolean).length

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
      {noRecords ? (
        <NoRecords />
      ) : (
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
      )}
    </Container>
  )
}

const CustomerActions = ({ customer }: { customer: Customer }) => {
  const { t } = useTranslation()

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: <PencilSquare />,
              label: t("general.edit"),
              to: `/customers/${customer.id}/edit`,
            },
          ],
        },
      ]}
    />
  )
}

const columnHelper = createColumnHelper<Customer>()

const useColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("email", {
        header: t("fields.email"),
        cell: ({ getValue }) => <span>{getValue()}</span>,
      }),
      columnHelper.display({
        id: "name",
        header: t("fields.name"),
        cell: ({ row }) => {
          const name = [row.original.first_name, row.original.last_name]
            .filter(Boolean)
            .join(" ")

          return name || "-"
        },
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
