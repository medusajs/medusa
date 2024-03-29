import { PencilSquare, Trash } from "@medusajs/icons"
import { Product, SalesChannel } from "@medusajs/medusa"
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
  useAdminDeleteProductsFromSalesChannel,
  useAdminProducts,
} from "medusa-react"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import {
  ProductStatusCell,
  ProductTitleCell,
  ProductVariantCell,
} from "../../../../../components/common/product-table-cells"
import { LocalizedTablePagination } from "../../../../../components/localization/localized-table-pagination"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { FilterGroup } from "../../../../../components/filtering/filter-group"
import { OrderBy } from "../../../../../components/filtering/order-by"
import { Query } from "../../../../../components/filtering/query"
import { useQueryParams } from "../../../../../hooks/use-query-params"
import { queryClient } from "../../../../../lib/medusa"

const PAGE_SIZE = 10

type SalesChannelProductSection = {
  salesChannel: SalesChannel
}

export const SalesChannelProductSection = ({
  salesChannel,
}: SalesChannelProductSection) => {
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
      sales_channel_id: [salesChannel.id],
      limit: PAGE_SIZE,
      offset: pageIndex * PAGE_SIZE,
      ...params,
    },
    {
      keepPreviousData: true,
    }
  )

  const columns = useListColumns(salesChannel.id)

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
  })

  const { mutateAsync } = useAdminDeleteProductsFromSalesChannel(
    salesChannel.id
  )
  const prompt = usePrompt()

  const { t } = useTranslation()

  const onRemove = async () => {
    const ids = Object.keys(rowSelection).map((k) => ({ id: k }))

    const result = await prompt({
      title: t("general.areYouSure"),
      description: t("salesChannels.removeProductsWarning", {
        count: ids.length,
        sales_channel: salesChannel.name,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!result) {
      return
    }

    await mutateAsync(
      {
        product_ids: ids,
      },
      {
        onSuccess: () => {
          setRowSelection({})
          queryClient.invalidateQueries(adminProductKeys.lists())
        },
      }
    )
  }

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("products.domain")}</Heading>
        <Link to={`/settings/sales-channels/${salesChannel.id}/add-products`}>
          <Button size="small" variant="secondary">
            {t("general.add")}
          </Button>
        </Link>
      </div>
      <div className="flex items-center justify-between px-6 py-4">
        <FilterGroup
          filters={{
            collection: "Collection",
          }}
        />
        <div className="flex items-center gap-x-2">
          <Query />
          <OrderBy keys={["title", "status", "created_at", "updated_at"]} />
        </div>
      </div>
      <div>
        <Table>
          <Table.Header className="border-t-0">
            {table.getHeaderGroups().map((headerGroup) => {
              return (
                <Table.Row
                  key={headerGroup.id}
                  className="[&_th:first-of-type]:w-[1%] [&_th:first-of-type]:whitespace-nowrap [&_th:last-of-type]:w-[1%] [&_th:last-of-type]:whitespace-nowrap [&_th]:w-1/3"
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
                  "transition-fg [&_td:last-of-type]:w-[1%] [&_td:last-of-type]:whitespace-nowrap",
                  {
                    "bg-ui-bg-highlight hover:bg-ui-bg-highlight-hover":
                      row.getIsSelected(),
                  }
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <Table.Cell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
        <CommandBar open={!!Object.keys(rowSelection).length}>
          <CommandBar.Bar>
            <CommandBar.Value>
              {t("general.countSelected", {
                count: Object.keys(rowSelection).length,
              })}
            </CommandBar.Value>
            <CommandBar.Seperator />
            <CommandBar.Command
              action={onRemove}
              shortcut="r"
              label={t("actions.remove")}
            />
          </CommandBar.Bar>
        </CommandBar>
      </div>
    </Container>
  )
}

const listColumnHelper = createColumnHelper<Product>()

const useListColumns = (id: string) => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      listColumnHelper.display({
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
      listColumnHelper.accessor("title", {
        header: t("fields.title"),
        cell: ({ row }) => {
          const product = row.original

          return <ProductTitleCell product={product} />
        },
      }),
      listColumnHelper.accessor("variants", {
        header: t("fields.variants"),
        cell: (cell) => {
          const variants = cell.getValue()

          return <ProductVariantCell variants={variants} />
        },
      }),
      listColumnHelper.accessor("status", {
        header: t("fields.status"),
        cell: ({ getValue }) => {
          const status = getValue()

          return <ProductStatusCell status={status} />
        },
      }),
      listColumnHelper.display({
        id: "actions",
        cell: ({ row }) => {
          return (
            <ProductListCellActions
              productId={row.original.id}
              salesChannelId={id}
            />
          )
        },
      }),
    ],
    [t]
  )
}

const ProductListCellActions = ({
  salesChannelId,
  productId,
}: {
  productId: string
  salesChannelId: string
}) => {
  const { t } = useTranslation()
  const { mutateAsync } = useAdminDeleteProductsFromSalesChannel(salesChannelId)

  const onRemove = async () => {
    await mutateAsync({
      product_ids: [{ id: productId }],
    })
  }

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: <PencilSquare />,
              label: t("actions.edit"),
              to: `/products/${productId}`,
            },
          ],
        },
        {
          actions: [
            {
              icon: <Trash />,
              label: t("actions.remove"),
              onClick: onRemove,
            },
          ],
        },
      ]}
    />
  )
}
