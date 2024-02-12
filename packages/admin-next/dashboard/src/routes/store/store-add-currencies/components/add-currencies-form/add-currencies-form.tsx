import { Currency, type Store } from "@medusajs/medusa"
import {
  Badge,
  Button,
  Checkbox,
  FocusModal,
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
import { useAdminCurrencies, useAdminUpdateStore } from "medusa-react"
import { FormEvent, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import * as zod from "zod"
import { OrderBy } from "../../../../../components/filtering/order-by"
import { LocalizedTablePagination } from "../../../../../components/localization/localized-table-pagination"
import { useHandleTableScroll } from "../../../../../hooks/use-handle-table-scroll"
import { useQueryParams } from "../../../../../hooks/use-query-params"

type AddCurrenciesFormProps = {
  store: Store
}

const AddCurrenciesSchema = zod.object({
  currencies: zod.array(zod.string()).min(1),
})

const PAGE_SIZE = 50

export const AddCurrenciesForm = ({ store }: AddCurrenciesFormProps) => {
  const [errorMessage, setErrorMessage] = useState<{
    currencies?: string | undefined
  }>({})
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

  const params = useQueryParams(["order"])
  const { currencies, count, isLoading, isError, error } = useAdminCurrencies({
    limit: PAGE_SIZE,
    offset: pageIndex * PAGE_SIZE,
    ...params,
  })

  const preSelectedRows = store.currencies.map((c) => c.code)

  const columns = useColumns()

  const table = useReactTable({
    data: currencies ?? [],
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

  const { t } = useTranslation()

  const { mutateAsync, isLoading: isMutating } = useAdminUpdateStore()

  const { handleScroll, isScrolled, tableContainerRef } = useHandleTableScroll()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const ids = Object.keys(rowSelection)

    try {
      AddCurrenciesSchema.parse({
        currencies: ids,
      })

      setErrorMessage({})
    } catch (err) {
      if (err instanceof zod.ZodError) {
        setErrorMessage(err.flatten().fieldErrors)
      }

      return
    }

    const currencies = Array.from(
      new Set([...ids, ...preSelectedRows])
    ) as string[]

    await mutateAsync({
      currencies,
    })
  }

  if (isError) {
    throw error
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full flex-col overflow-hidden"
    >
      <FocusModal.Header>
        <div className="flex flex-1 items-center justify-between">
          <div>
            {errorMessage.currencies && (
              <Hint variant="error">{errorMessage.currencies}</Hint>
            )}
          </div>
          <div className="flex items-center justify-end gap-x-2">
            <FocusModal.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </FocusModal.Close>
            <Button size="small" type="submit" isLoading={isMutating}>
              {t("actions.save")}
            </Button>
          </div>
        </div>
      </FocusModal.Header>
      <FocusModal.Body className="flex flex-1 flex-col overflow-hidden">
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
      </FocusModal.Body>
    </form>
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
