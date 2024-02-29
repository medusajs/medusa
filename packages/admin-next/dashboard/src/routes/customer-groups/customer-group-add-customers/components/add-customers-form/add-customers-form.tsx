import { zodResolver } from "@hookform/resolvers/zod"
import { Customer } from "@medusajs/medusa"
import { Button, Checkbox, Hint, Table, Tooltip, clx } from "@medusajs/ui"
import {
  PaginationState,
  RowSelectionState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  adminCustomerKeys,
  useAdminAddCustomersToCustomerGroup,
  useAdminCustomers,
} from "medusa-react"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import {
  NoRecords,
  NoResults,
} from "../../../../../components/common/empty-table-content"
import { Query } from "../../../../../components/filtering/query"
import { LocalizedTablePagination } from "../../../../../components/localization/localized-table-pagination"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { useQueryParams } from "../../../../../hooks/use-query-params"
import { queryClient } from "../../../../../lib/medusa"

type AddCustomersFormProps = {
  customerGroupId: string
}

const AddCustomersSchema = zod.object({
  customer_ids: zod.array(zod.string()).min(1),
})

const PAGE_SIZE = 10

export const AddCustomersForm = ({
  customerGroupId,
}: AddCustomersFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof AddCustomersSchema>>({
    defaultValues: {
      customer_ids: [],
    },
    resolver: zodResolver(AddCustomersSchema),
  })

  const { setValue } = form

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

  useEffect(() => {
    setValue(
      "customer_ids",
      Object.keys(rowSelection).filter((k) => rowSelection[k]),
      {
        shouldDirty: true,
        shouldTouch: true,
      }
    )
  }, [rowSelection, setValue])

  const params = useQueryParams(["q"])
  const { customers, count, isLoading, isError, error } = useAdminCustomers({
    expand: "groups",
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
      rowSelection,
    },
    getRowId: (row) => row.id,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    meta: {
      customerGroupId,
    },
  })

  const { mutateAsync, isLoading: isMutating } =
    useAdminAddCustomersToCustomerGroup(customerGroupId)

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      {
        customer_ids: data.customer_ids.map((id) => ({ id })),
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(adminCustomerKeys.lists())
          handleSuccess(`/customer-groups/${customerGroupId}`)
        },
      }
    )
  })

  const noRecords =
    !isLoading &&
    !customers?.length &&
    !Object.values(params).filter(Boolean).length

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal.Form form={form}>
      <form
        className="flex h-full flex-col overflow-hidden"
        onSubmit={handleSubmit}
      >
        <RouteFocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            {form.formState.errors.customer_ids && (
              <Hint variant="error">
                {form.formState.errors.customer_ids.message}
              </Hint>
            )}
            <RouteFocusModal.Close asChild>
              <Button variant="secondary" size="small">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button
              type="submit"
              variant="primary"
              size="small"
              isLoading={isMutating}
            >
              {t("general.add")}
            </Button>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex h-full w-full flex-col items-center divide-y overflow-y-auto">
          {noRecords ? (
            <div className="flex w-full flex-1 items-center justify-center">
              <NoRecords />
            </div>
          ) : (
            <div className="flex w-full flex-1 flex-col divide-y">
              <div className="flex w-full items-center justify-between px-6 py-4">
                <div></div>
                <div className="flex items-center gap-x-2">
                  <Query />
                </div>
              </div>
              <div className="w-full flex-1 overflow-y-auto">
                {(customers?.length || 0) > 0 ? (
                  <Table>
                    <Table.Header className="border-t-0">
                      {table.getHeaderGroups().map((headerGroup) => {
                        return (
                          <Table.Row
                            key={headerGroup.id}
                            className="[&_th:first-of-type]:w-[1%] [&_th:first-of-type]:whitespace-nowrap"
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
                            "transition-fg",
                            {
                              "bg-ui-bg-highlight hover:bg-ui-bg-highlight-hover":
                                row.getIsSelected(),
                            },
                            {
                              "bg-ui-bg-disabled hover:bg-ui-bg-disabled":
                                row.original.groups
                                  ?.map((cg) => cg.id)
                                  .includes(customerGroupId),
                            }
                          )}
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
                  <div className="flex min-h-full flex-1 items-center justify-center">
                    <NoResults />
                  </div>
                )}
              </div>
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
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}

const columnHelper = createColumnHelper<Customer>()

const useColumns = () => {
  const { t } = useTranslation()

  const columns = useMemo(
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
        cell: ({ row, table }) => {
          const { customerGroupId } = table.options.meta as {
            customerGroupId: string
          }

          const isAdded = row.original.groups
            ?.map((gc) => gc.id)
            .includes(customerGroupId)

          const isSelected = row.getIsSelected() || isAdded

          const Component = (
            <Checkbox
              checked={isSelected}
              disabled={isAdded}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              onClick={(e) => {
                e.stopPropagation()
              }}
            />
          )

          if (isAdded) {
            return (
              <Tooltip
                content={t("customerGroups.customerAlreadyAdded")}
                side="right"
              >
                {Component}
              </Tooltip>
            )
          }

          return Component
        },
      }),
      columnHelper.accessor("email", {
        header: t("fields.email"),
        cell: ({ getValue }) => getValue(),
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
    ],
    [t]
  )

  return columns
}
