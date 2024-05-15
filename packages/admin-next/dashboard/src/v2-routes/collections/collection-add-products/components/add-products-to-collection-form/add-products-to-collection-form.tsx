import { ProductCollectionDTO, ProductDTO } from "@medusajs/types"
import {
  Button,
  Checkbox,
  clx,
  Hint,
  Table,
  toast,
  Tooltip,
} from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { keepPreviousData } from "@tanstack/react-query"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  PaginationState,
  RowSelectionState,
  useReactTable,
} from "@tanstack/react-table"
import { Fragment, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import * as zod from "zod"
import { useProductTableColumns } from "../../../../../hooks/table/columns/use-product-table-columns"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { useQueryParams } from "../../../../../hooks/use-query-params"
import { useProducts } from "../../../../../hooks/api/products"
import { adminProductKeys } from "medusa-react"
import { useHandleTableScroll } from "../../../../../hooks/use-handle-table-scroll.tsx"
import { Query } from "../../../../../components/filtering/query"
import { OrderBy } from "../../../../../components/filtering/order-by"
import {
  NoRecords,
  NoResults,
} from "../../../../../components/common/empty-table-content"
import { LocalizedTablePagination } from "../../../../../components/localization/localized-table-pagination"
import { useUpdateCollectionProducts } from "../../../../../hooks/api/collections"
import { queryClient } from "../../../../../lib/medusa"

// Re-add when supported on the backend

type AddProductsToCollectionFormProps = {
  collection: ProductCollectionDTO
}

const AddProductsToCollectionSchema = zod.object({
  product_ids: zod.array(zod.string()).min(1),
})

const PAGE_SIZE = 50

export const AddProductsToCollectionForm = ({
  collection,
}: AddProductsToCollectionFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof AddProductsToCollectionSchema>>({
    defaultValues: {
      product_ids: [],
    },
    resolver: zodResolver(AddProductsToCollectionSchema),
  })

  const { setValue } = form

  const { mutateAsync, isPending: isMutating } = useUpdateCollectionProducts(
    collection.id
  )

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

  const { products, count, isLoading, isError, error } = useProducts(
    {
      fields: "*variants,*sales_channels",
      ...params,
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  const columns = useColumns()

  const table = useReactTable({
    data: (products ?? []) as ProductDTO[],
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
      return row.original.collection_id !== collection.id
    },
    meta: {
      collectionId: collection.id,
    },
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await mutateAsync({
        add: values.product_ids,
      })
      /**
       * Invalidate the products list query to refetch products and
       * determine if they are added to the collection or not.
       */
      queryClient.invalidateQueries(adminProductKeys.lists())
      handleSuccess()
    } catch (e) {
      toast.error(t("general.error"), {
        description: e.message,
        dismissLabel: t("actions.close"),
      })
    }
  })

  const { handleScroll, isScrolled, tableContainerRef } = useHandleTableScroll()

  const noRecords =
    !isLoading &&
    products?.length === 0 &&
    !Object.values(params).filter((v) => v).length

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
          {!noRecords && (
            <div className="flex w-full items-center justify-between px-6 py-4">
              <div></div>
              <div className="flex items-center gap-x-2">
                <Query />
                <OrderBy keys={["title"]} />
              </div>
            </div>
          )}
          {!noRecords ? (
            <Fragment>
              <div
                ref={tableContainerRef}
                className="w-full flex-1 overflow-y-auto"
                onScroll={handleScroll}
              >
                {!isLoading && !products?.length ? (
                  <div className="flex h-full flex-1 items-center justify-center">
                    <NoResults />
                  </div>
                ) : (
                  <Table>
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
                            className="[&_th:first-of-type]:w-[1%] [&_th:first-of-type]:whitespace-nowrap [&_th]:w-1/5"
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
                                row.original.collection_id === collection.id,
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
                )}
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
            </Fragment>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <NoRecords />
            </div>
          )}
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}

const columnHelper = createColumnHelper<ProductDTO>()

const useColumns = () => {
  const { t } = useTranslation()
  const base = useProductTableColumns()

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
          const { collectionId } = table.options.meta as {
            collectionId: string
          }

          const isAdded = row.original.collection_id === collectionId

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
      ...base,
    ],
    [t, base]
  )
}
