import { zodResolver } from "@hookform/resolvers/zod"
import { SalesChannel } from "@medusajs/medusa"
import {
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
import {
  useAdminAddPublishableKeySalesChannelsBatch,
  useAdminSalesChannels,
} from "medusa-react"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"
import { Form } from "../../../../components/common/form"
import { OrderBy } from "../../../../components/filtering/order-by"
import { Query } from "../../../../components/filtering/query"
import { LocalizedTablePagination } from "../../../../components/localization/localized-table-pagination"
import { useQueryParams } from "../../../../hooks/use-query-params"

type AddSalesChannelsToApiKeyFormProps = {
  apiKey: string
  preSelected: string[]
  subscribe: (state: boolean) => void
  onSuccessfulSubmit: () => void
}

const AddSalesChannelsToApiKeySchema = zod.object({
  sales_channel_ids: zod.array(zod.string()).min(1),
})

const PAGE_SIZE = 50

export const AddSalesChannelsToApiKeyForm = ({
  apiKey,
  preSelected,
  subscribe,
  onSuccessfulSubmit,
}: AddSalesChannelsToApiKeyFormProps) => {
  const { t } = useTranslation()

  const form = useForm<zod.infer<typeof AddSalesChannelsToApiKeySchema>>({
    defaultValues: {
      sales_channel_ids: [],
    },
    resolver: zodResolver(AddSalesChannelsToApiKeySchema),
  })

  const {
    formState: { isDirty },
    setValue,
  } = form

  useEffect(() => {
    subscribe(isDirty)
  }, [isDirty, subscribe])

  const { mutateAsync, isLoading: isMutating } =
    useAdminAddPublishableKeySalesChannelsBatch(apiKey)

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
      "sales_channel_ids",
      Object.keys(rowSelection).filter((k) => rowSelection[k])
    )
  }, [rowSelection, setValue])

  const params = useQueryParams(["q", "order"])
  const { sales_channels, count } = useAdminSalesChannels(
    {
      limit: PAGE_SIZE,
      offset: PAGE_SIZE * pageIndex,
      ...params,
    },
    {
      keepPreviousData: true,
    }
  )

  const columns = useColumns()

  const table = useReactTable({
    data: sales_channels ?? [],
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
    getRowId: (row) => row.id,
    enableRowSelection: (row) => {
      return !preSelected.includes(row.id)
    },
    meta: {
      preSelected,
    },
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(
      {
        sales_channel_ids: values.sales_channel_ids.map((p) => ({ id: p })),
      },
      {
        onSuccess: () => {
          onSuccessfulSubmit()
        },
      }
    )
  })

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className="flex h-full flex-col overflow-hidden"
      >
        <FocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            {form.formState.errors.sales_channel_ids && (
              <Hint variant="error">
                {form.formState.errors.sales_channel_ids.message}
              </Hint>
            )}
            <FocusModal.Close asChild>
              <Button size="small" variant="secondary">
                {t("general.cancel")}
              </Button>
            </FocusModal.Close>
            <Button size="small" type="submit" isLoading={isMutating}>
              {t("general.save")}
            </Button>
          </div>
        </FocusModal.Header>
        <FocusModal.Body className="flex h-full w-full flex-col items-center divide-y overflow-y-auto">
          <div className="flex w-full items-center justify-between px-6 py-4">
            <div></div>
            <div className="flex items-center gap-x-2">
              <Query />
              <OrderBy keys={["title"]} />
            </div>
          </div>
          <div className="w-full flex-1 overflow-y-auto">
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
                          preSelected.includes(row.original.id),
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
    </Form>
  )
}

const columnHelper = createColumnHelper<SalesChannel>()

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
        cell: ({ row, table }) => {
          const { preSelected } = table.options.meta as {
            preSelected: string[]
          }

          const isAdded = preSelected.includes(row.original.id)
          const isSelected = row.getIsSelected() || isAdded

          const Component = (
            <Checkbox
              checked={isSelected}
              disabled={isAdded}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
            />
          )

          if (isAdded) {
            return (
              <Tooltip
                content={t("salesChannels.productAlreadyAdded")}
                side="right"
              >
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
      columnHelper.accessor("description", {
        header: t("fields.description"),
        cell: ({ getValue }) => (
          <div className="w-[200px] truncate">
            <span>{getValue()}</span>
          </div>
        ),
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
    ],
    [t]
  )
}
