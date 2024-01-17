import { PencilSquare, Trash } from "@medusajs/icons"
import { Customer, CustomerGroup } from "@medusajs/medusa"
import {
  Button,
  Checkbox,
  CommandBar,
  Container,
  Heading,
  StatusBadge,
  Table,
  clx,
  usePrompt,
} from "@medusajs/ui"
import {
  PaginationState,
  RowSelectionState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  useAdminCustomerGroupCustomers,
  useAdminRemoveCustomersFromCustomerGroup,
} from "medusa-react"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"
import {
  NoRecords,
  NoResults,
} from "../../../../../components/common/empty-table-content"
import { Query } from "../../../../../components/filtering/query"
import { LocalizedTablePagination } from "../../../../../components/localization/localized-table-pagination"
import { useQueryParams } from "../../../../../hooks/use-query-params"

type CustomerGroupCustomerSectionProps = {
  group: CustomerGroup
}

const PAGE_SIZE = 10

export const CustomerGroupCustomerSection = ({
  group,
}: CustomerGroupCustomerSectionProps) => {
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

  const params = useQueryParams(["q"])
  const { customers, count, isLoading, isError, error } =
    useAdminCustomerGroupCustomers(
      group.id,
      {
        limit: PAGE_SIZE,
        offset: pageIndex * PAGE_SIZE,
        ...params,
      },
      {
        keepPreviousData: true,
      }
    )

  const columns = useColumns()

  const table = useReactTable({
    data: customers ?? [],
    columns,
    pageCount: Math.ceil((count ?? 0) / PAGE_SIZE),
    state: {
      pagination,
      rowSelection,
    },
    getRowId: (row) => row.id,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    meta: {
      customerGroupId: group.id,
    },
  })

  const { mutateAsync } = useAdminRemoveCustomersFromCustomerGroup(group.id)
  const prompt = usePrompt()

  const handleRemoveCustomers = async () => {
    const selected = Object.keys(rowSelection).filter((k) => rowSelection[k])

    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("customerGroups.removeCustomersWarning", {
        count: selected.length,
      }),
      confirmText: t("general.continue"),
      cancelText: t("general.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync(
      {
        customer_ids: selected.map((s) => ({ id: s })),
      },
      {
        onSuccess: () => {
          setRowSelection({})
        },
      }
    )
  }

  const noRecords =
    !isLoading &&
    !customers?.length &&
    !Object.values(params).filter(Boolean).length

  if (isError) {
    throw error
  }

  return (
    <Container className="p-0 divide-y">
      <div className="px-6 py-4 flex items-center justify-between">
        <Heading level="h2">{t("customers.domain")}</Heading>
        <Link to={`/customer-groups/${group.id}/add-customers`}>
          <Button variant="secondary" size="small">
            {t("general.add")}
          </Button>
        </Link>
      </div>
      <div>
        {noRecords ? (
          <NoRecords />
        ) : (
          <div className="divide-y">
            <div className="px-6 py-4 flex items-center justify-between">
              <div></div>
              <div className="flex items-center gap-x-2">
                <Query />
              </div>
            </div>
            <div>
              {(customers?.length || 0) > 0 ? (
                <Table>
                  <Table.Header className="border-t-0">
                    {table.getHeaderGroups().map((headerGroup) => {
                      return (
                        <Table.Row
                          key={headerGroup.id}
                          className=" [&_th:last-of-type]:w-[1%] [&_th:last-of-type]:whitespace-nowrap [&_th:first-of-type]:w-[1%] [&_th:first-of-type]:whitespace-nowrap"
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
                          "transition-fg cursor-pointer [&_td:last-of-type]:w-[1%] [&_td:last-of-type]:whitespace-nowrap [&_td:first-of-type]:w-[1%] [&_td:first-of-type]:whitespace-nowrap",
                          {
                            "bg-ui-bg-highlight hover:bg-ui-bg-highlight-hover":
                              row.getIsSelected(),
                          }
                        )}
                        onClick={() =>
                          navigate(`/customers/${row.original.id}`)
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
              <CommandBar open={!!Object.keys(rowSelection).length}>
                <CommandBar.Bar>
                  <CommandBar.Value>
                    {t("general.countSelected", {
                      count: Object.keys(rowSelection).length,
                    })}
                  </CommandBar.Value>
                  <CommandBar.Seperator />
                  <CommandBar.Command
                    action={handleRemoveCustomers}
                    shortcut="r"
                    label={t("general.remove")}
                  />
                </CommandBar.Bar>
              </CommandBar>
            </div>
          </div>
        )}
      </div>
    </Container>
  )
}

const CustomerActions = ({
  customer,
  customerGroupId,
}: {
  customer: Customer
  customerGroupId: string
}) => {
  const { t } = useTranslation()
  const { mutateAsync } =
    useAdminRemoveCustomersFromCustomerGroup(customerGroupId)

  const prompt = usePrompt()

  const handleRemove = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("customerGroups.removeCustomersWarning", {
        count: 1,
      }),
      confirmText: t("general.continue"),
      cancelText: t("general.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync({
      customer_ids: [{ id: customer.id }],
    })
  }

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
        {
          actions: [
            {
              icon: <Trash />,
              label: t("general.remove"),
              onClick: handleRemove,
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
        cell: ({ row, table }) => {
          const { customerGroupId } = table.options.meta as {
            customerGroupId: string
          }

          return (
            <CustomerActions
              customer={row.original}
              customerGroupId={customerGroupId}
            />
          )
        },
      }),
    ],
    [t]
  )
}
