import { PencilSquare, Trash } from "@medusajs/icons"
import type { Product, ProductCollection } from "@medusajs/medusa"
import {
  Button,
  Checkbox,
  CommandBar,
  Container,
  Heading,
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
  adminProductKeys,
  useAdminProducts,
  useAdminRemoveProductsFromCollection,
} from "medusa-react"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"
import {
  NoRecords,
  NoResults,
} from "../../../../../components/common/empty-table-content"
import {
  ProductAvailabilityCell,
  ProductCollectionCell,
  ProductStatusCell,
  ProductTitleCell,
  ProductVariantCell,
} from "../../../../../components/common/product-table-cells"
import { OrderBy } from "../../../../../components/filtering/order-by"
import { Query } from "../../../../../components/filtering/query"
import { LocalizedTablePagination } from "../../../../../components/localization/localized-table-pagination"
import { useQueryParams } from "../../../../../hooks/use-query-params"
import { queryClient } from "../../../../../lib/medusa"

type CollectionProductSectionProps = {
  collection: ProductCollection
}

const PAGE_SIZE = 10

export const CollectionProductSection = ({
  collection,
}: CollectionProductSectionProps) => {
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

  const params = useQueryParams(["q", "order"])
  const { products, count, isLoading, isError, error } = useAdminProducts(
    {
      limit: PAGE_SIZE,
      offset: pageIndex * PAGE_SIZE,
      collection_id: [collection.id],
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
    getRowId: (row) => row.id,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    meta: {
      collectionId: collection.id,
    },
  })

  const prompt = usePrompt()
  const { mutateAsync } = useAdminRemoveProductsFromCollection(collection.id)

  const handleRemove = async () => {
    const ids = Object.keys(rowSelection)

    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("collections.removeProductsWarning", {
        count: ids.length,
      }),
      confirmText: t("general.confirm"),
      cancelText: t("general.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync(
      {
        product_ids: ids,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(adminProductKeys.lists())
          setRowSelection({})
        },
      }
    )
  }

  const noRecords =
    !isLoading &&
    products?.length === 0 &&
    !Object.values(params).filter((v) => v).length

  if (isError) {
    throw error
  }

  return (
    <Container className="p-0 divide-y">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("products.domain")}</Heading>
        <Link to={`/collections/${collection.id}/add-products`}>
          <Button size="small" variant="secondary">
            {t("general.add")}
          </Button>
        </Link>
      </div>
      {!noRecords && (
        <div className="flex items-center justify-between px-6 py-4">
          <div></div>
          <div className="flex items-center gap-x-2">
            <Query />
            <OrderBy keys={["title", "status", "created_at", "updated_at"]} />
          </div>
        </div>
      )}
      {noRecords ? (
        <NoRecords />
      ) : (
        <div>
          {!isLoading && !products?.length ? (
            <div className="border-b">
              <NoResults />
            </div>
          ) : (
            <Table>
              <Table.Header className="border-t-0">
                {table.getHeaderGroups().map((headerGroup) => {
                  return (
                    <Table.Row
                      key={headerGroup.id}
                      className="[&_th:last-of-type]:w-[1%] [&_th:last-of-type]:whitespace-nowrap [&_th:first-of-type]:w-[1%] [&_th:first-of-type]:whitespace-nowrap [&_th]:w-1/5"
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
                    onClick={() => navigate(`/products/${row.original.id}`)}
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
                action={handleRemove}
                shortcut="r"
                label={t("general.remove")}
              />
            </CommandBar.Bar>
          </CommandBar>
        </div>
      )}
    </Container>
  )
}

const ProductActions = ({
  product,
  collectionId,
}: {
  product: Product
  collectionId: string
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const { mutateAsync } = useAdminRemoveProductsFromCollection(collectionId)

  const handleRemove = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("collections.removeSingleProductWarning", {
        title: product.title,
      }),
      confirmText: t("general.confirm"),
      cancelText: t("general.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync({
      product_ids: [product.id],
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
              to: `/products/${product.id}/edit`,
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
      columnHelper.accessor("title", {
        header: t("fields.title"),
        cell: ({ row }) => {
          return <ProductTitleCell product={row.original} />
        },
      }),
      columnHelper.accessor("collection", {
        header: t("fields.collection"),
        cell: (cell) => {
          const collection = cell.getValue()

          return <ProductCollectionCell collection={collection} />
        },
      }),
      columnHelper.accessor("sales_channels", {
        header: t("fields.availability"),
        cell: (cell) => {
          const salesChannels = cell.getValue()

          return <ProductAvailabilityCell salesChannels={salesChannels ?? []} />
        },
      }),
      columnHelper.accessor("variants", {
        header: t("fields.variants"),
        cell: (cell) => {
          const variants = cell.getValue()

          return <ProductVariantCell variants={variants} />
        },
      }),
      columnHelper.accessor("status", {
        header: t("fields.status"),
        cell: (cell) => {
          const value = cell.getValue()

          return <ProductStatusCell status={value} />
        },
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row, table }) => {
          const { collectionId } = table.options.meta as {
            collectionId: string
          }

          return (
            <ProductActions
              product={row.original}
              collectionId={collectionId}
            />
          )
        },
      }),
    ],
    [t]
  )
}
