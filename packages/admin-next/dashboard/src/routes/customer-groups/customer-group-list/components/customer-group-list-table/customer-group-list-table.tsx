import { PencilSquare, Trash } from "@medusajs/icons"
import { CustomerGroup } from "@medusajs/medusa"
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
  useAdminCustomerGroups,
  useAdminDeleteCustomerGroup,
} from "medusa-react"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"
import {
  NoRecords,
  NoResults,
} from "../../../../../components/common/empty-table-content"
import { OrderBy } from "../../../../../components/filtering/order-by"
import { Query } from "../../../../../components/filtering/query"
import { LocalizedTablePagination } from "../../../../../components/localization/localized-table-pagination"
import { useQueryParams } from "../../../../../hooks/use-query-params"

const PAGE_SIZE = 50

export const CustomerGroupListTable = () => {
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

  const params = useQueryParams(["q", "order"])
  const { customer_groups, count, isLoading, isError, error } =
    useAdminCustomerGroups({
      limit: PAGE_SIZE,
      offset: pageIndex * PAGE_SIZE,
      ...params,
    })

  const columns = useColumns()

  const table = useReactTable({
    data: customer_groups ?? [],
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

  const noRecords =
    !isLoading &&
    !customer_groups?.length &&
    !Object.values(params).filter(Boolean).length

  if (isError) {
    throw error
  }

  return (
    <Container className="p-0 divide-y">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("customerGroups.domain")}</Heading>
        <Link to="/customer-groups/create">
          <Button size="small" variant="secondary">
            {t("general.create")}
          </Button>
        </Link>
      </div>
      <div>
        {noRecords ? (
          <NoRecords
            action={{
              label: t("customerGroups.createGroup"),
              to: "/customer-groups/create",
            }}
          />
        ) : (
          <div className="divide-y">
            <div className="flex items-center px-6 py-2 justify-between">
              <div className="flex items-center gap-x-2"></div>
              <div className="flex items-center gap-x-2">
                <Query />
                <OrderBy keys={["name", "created_at", "updated_at"]} />
              </div>
            </div>
            <div>
              {(customer_groups?.length || 0) > 0 ? (
                <Table>
                  <Table.Header className="border-t-0">
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
                        onClick={() =>
                          navigate(`/customer-groups/${row.original.id}`)
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
                <div className="border-b">
                  <NoResults />
                </div>
              )}
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
          </div>
        )}
      </div>
    </Container>
  )
}

const CustomerGroupActions = ({ group }: { group: CustomerGroup }) => {
  const { t } = useTranslation()
  const prompt = usePrompt()

  const { mutateAsync } = useAdminDeleteCustomerGroup(group.id)

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("customerGroups.deleteCustomerGroupWarning", {
        name: group.name,
      }),
      confirmText: t("general.delete"),
      cancelText: t("general.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync(undefined)
  }

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: <PencilSquare />,
              label: t("general.edit"),
              to: `/customer-groups/${group.id}/edit`,
            },
          ],
        },
        {
          actions: [
            {
              icon: <Trash />,
              label: t("general.delete"),
              onClick: handleDelete,
            },
          ],
        },
      ]}
    />
  )
}

const columnHelper = createColumnHelper<CustomerGroup>()

const useColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("name", {
        header: t("fields.name"),
        cell: ({ getValue }) => getValue(),
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => <CustomerGroupActions group={row.original} />,
      }),
    ],
    [t]
  )
}
