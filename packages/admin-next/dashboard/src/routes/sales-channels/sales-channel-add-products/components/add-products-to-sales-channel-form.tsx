import { zodResolver } from "@hookform/resolvers/zod"
import { Product, SalesChannel } from "@medusajs/medusa"
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
  adminProductKeys,
  useAdminAddProductsToSalesChannel,
  useAdminProducts,
} from "medusa-react"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"
import {
  ProductAvailabilityCell,
  ProductCollectionCell,
  ProductStatusCell,
  ProductTitleCell,
  ProductVariantCell,
} from "../../../../components/common/product-table-cells"
import { OrderBy } from "../../../../components/filtering/order-by"
import { Query } from "../../../../components/filtering/query"
import { LocalizedTablePagination } from "../../../../components/localization/localized-table-pagination"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../components/route-modal"
import { useQueryParams } from "../../../../hooks/use-query-params"
import { queryClient } from "../../../../lib/medusa"

type AddProductsToSalesChannelFormProps = {
  salesChannel: SalesChannel
}

const AddProductsToSalesChannelSchema = zod.object({
  product_ids: zod.array(zod.string()).min(1),
})

const PAGE_SIZE = 50

export const AddProductsToSalesChannelForm = ({
  salesChannel,
}: AddProductsToSalesChannelFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof AddProductsToSalesChannelSchema>>({
    defaultValues: {
      product_ids: [],
    },
    resolver: zodResolver(AddProductsToSalesChannelSchema),
  })

  const { setValue } = form

  const { mutateAsync, isLoading: isMutating } =
    useAdminAddProductsToSalesChannel(salesChannel.id)

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
      "product_ids",
      Object.keys(rowSelection).filter((k) => rowSelection[k]),
      {
        shouldDirty: true,
        shouldTouch: true,
      }
    )
  }, [rowSelection, setValue])

  const params = useQueryParams(["q", "order"])

  const { products, count } = useAdminProducts(
    {
      expand: "variants,sales_channels",
      ...params,
    },
    {
      keepPreviousData: true,
    }
  )

  const columns = useColumns()

  const table = useReactTable({
    data: (products ?? []) as Product[],
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
    enableRowSelection(row) {
      return !row.original.sales_channels
        ?.map((sc) => sc.id)
        .includes(salesChannel.id)
    },
    meta: {
      salesChannelId: salesChannel.id,
    },
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(
      {
        product_ids: values.product_ids.map((p) => ({ id: p })),
      },
      {
        onSuccess: () => {
          /**
           * Invalidate the products list query to refetch products and
           * determine if they are added to the sales channel or not.
           */
          queryClient.invalidateQueries(adminProductKeys.lists())
          handleSuccess()
        },
      }
    )
  })

  return (
    <RouteFocusModal.Form form={form}>
      <form
        onSubmit={handleSubmit}
        className="flex h-full flex-col overflow-hidden"
      >
        <RouteFocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            {form.formState.errors.product_ids && (
              <Hint variant="error">
                {form.formState.errors.product_ids.message}
              </Hint>
            )}
            <RouteFocusModal.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button size="small" type="submit" isLoading={isMutating}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex h-full w-full flex-col items-center divide-y overflow-y-auto">
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
                          row.original.sales_channels
                            ?.map((sc) => sc.id)
                            .includes(salesChannel.id),
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

const columnHelper = createColumnHelper<Product>()

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
          const { salesChannelId } = table.options.meta as {
            salesChannelId: string
          }

          const isAdded = row.original.sales_channels
            ?.map((sc) => sc.id)
            .includes(salesChannelId)

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
      columnHelper.accessor("title", {
        header: t("fields.title"),
        cell: ({ row }) => {
          const product = row.original

          return <ProductTitleCell product={product} />
        },
      }),
      columnHelper.accessor("collection", {
        header: t("fields.collection"),
        cell: ({ getValue }) => {
          const collection = getValue()

          return <ProductCollectionCell collection={collection} />
        },
      }),
      columnHelper.accessor("sales_channels", {
        header: t("fields.availability"),
        cell: ({ getValue }) => {
          const salesChannels = getValue()

          return <ProductAvailabilityCell salesChannels={salesChannels} />
        },
      }),
      columnHelper.accessor("variants", {
        header: t("fields.inventory"),
        cell: (cell) => {
          const variants = cell.getValue()

          return <ProductVariantCell variants={variants} />
        },
      }),
      columnHelper.accessor("status", {
        header: t("fields.status"),
        cell: ({ getValue }) => {
          const status = getValue()

          return <ProductStatusCell status={status} />
        },
      }),
    ],
    [t]
  )
}
