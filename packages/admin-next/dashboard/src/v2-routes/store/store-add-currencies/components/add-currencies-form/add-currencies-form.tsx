import { Currency } from "@medusajs/medusa"
import {
  Badge,
  Button,
  Checkbox,
  Hint,
  StatusBadge,
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
import {
  adminCurrenciesKeys,
  adminStoreKeys,
  useAdminCustomPost,
  useAdminCustomQuery,
} from "medusa-react"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { OrderBy } from "../../../../../components/filtering/order-by"
import { LocalizedTablePagination } from "../../../../../components/localization/localized-table-pagination"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { useHandleTableScroll } from "../../../../../hooks/use-handle-table-scroll"
import { useQueryParams } from "../../../../../hooks/use-query-params"
import { StoreDTO } from "@medusajs/types"

type AddCurrenciesFormProps = {
  store: StoreDTO
}

const AddCurrenciesSchema = zod.object({
  currencies: zod.array(zod.string()).min(1),
})

const PAGE_SIZE = 50

export const AddCurrenciesForm = ({ store }: AddCurrenciesFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof AddCurrenciesSchema>>({
    defaultValues: {
      currencies: [],
    },
    resolver: zodResolver(AddCurrenciesSchema),
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
    const ids = Object.keys(rowSelection)
    setValue("currencies", ids, {
      shouldDirty: true,
      shouldTouch: true,
    })
  }, [rowSelection, setValue])

  const params = useQueryParams(["order"])
  const filter = {
    limit: PAGE_SIZE,
    offset: pageIndex * PAGE_SIZE,
    ...params,
  }
  // @ts-ignore
  const { data, count, isError, error } = useAdminCustomQuery(
    "/admin/currencies",
    adminCurrenciesKeys.list(filter),
    filter
  )

  const preSelectedRows = store.supported_currency_codes.map((c) => c)

  const columns = useColumns()

  const table = useReactTable({
    data: data?.currencies ?? [],
    columns,
    pageCount: Math.ceil((count ?? 0) / PAGE_SIZE),
    state: {
      pagination,
      rowSelection,
    },
    getRowId: (row) => row.code,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: (row) => !preSelectedRows.includes(row.original.code),
    manualPagination: true,
  })

  const { mutateAsync, isLoading: isMutating } = useAdminCustomPost(
    `/admin/stores/${store.id}`,
    adminStoreKeys.details()
  )

  const { handleScroll, isScrolled, tableContainerRef } = useHandleTableScroll()

  const handleSubmit = form.handleSubmit(async (data) => {
    const currencies = Array.from(
      new Set([...data.currencies, ...preSelectedRows])
    ) as string[]

    await mutateAsync(
      {
        supported_currency_codes: currencies,
      },
      {
        onSuccess: () => {
          handleSuccess()
        },
      }
    )
  })

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal.Form form={form}>
      <form
        onSubmit={handleSubmit}
        className="flex h-full flex-col overflow-hidden"
      >
        <RouteFocusModal.Header>
          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center">
              {form.formState.errors.currencies && (
                <Hint variant="error">
                  {form.formState.errors.currencies.message}
                </Hint>
              )}
            </div>
            <div className="flex items-center justify-end gap-x-2">
              <RouteFocusModal.Close asChild>
                <Button size="small" variant="secondary">
                  {t("actions.cancel")}
                </Button>
              </RouteFocusModal.Close>
              <Button size="small" type="submit" isLoading={isMutating}>
                {t("actions.save")}
              </Button>
            </div>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex flex-1 flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div></div>
            <div className="flex items-center gap-x-2">
              <OrderBy keys={["code"]} />
            </div>
          </div>
          <div
            className="flex-1 overflow-y-auto"
            ref={tableContainerRef}
            onScroll={handleScroll}
          >
            <Table className="relative">
              <Table.Header
                className={clx(
                  "bg-ui-bg-base transition-fg sticky inset-x-0 top-0 z-10 border-t-0",
                  {
                    "shadow-elevation-card-hover": isScrolled,
                  }
                )}
              >
                {table.getHeaderGroups().map((headerGroup) => {
                  return (
                    <Table.Row
                      key={headerGroup.id}
                      className="[&_th:first-of-type]:w-[1%] [&_th:first-of-type]:whitespace-nowrap [&_th]:w-1/3"
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
                      "transition-fg last-of-type:border-b-0",
                      {
                        "bg-ui-bg-highlight hover:bg-ui-bg-highlight-hover":
                          row.getIsSelected(),
                      },
                      {
                        "bg-ui-bg-disabled hover:bg-ui-bg-disabled":
                          !row.getCanSelect(),
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
          </div>
          <div className="w-full border-t">
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
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}

const columnHelper = createColumnHelper<Currency>()

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
      columnHelper.accessor("name", {
        header: t("fields.name"),
        cell: ({ getValue }) => getValue(),
      }),
      columnHelper.accessor("code", {
        header: t("fields.code"),
        cell: ({ getValue }) => (
          <Badge size="small">{getValue().toUpperCase()}</Badge>
        ),
      }),
      columnHelper.accessor("includes_tax", {
        header: t("fields.taxInclusivePricing"),
        cell: ({ getValue }) => {
          const value = getValue()

          return (
            <StatusBadge color={value ? "green" : "red"}>
              {value ? t("general.enabled") : t("general.disabled")}
            </StatusBadge>
          )
        },
      }),
    ],
    [t]
  )
}
