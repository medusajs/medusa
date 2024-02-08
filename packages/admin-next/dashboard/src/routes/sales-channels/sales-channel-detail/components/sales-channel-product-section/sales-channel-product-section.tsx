import { PencilSquare, Trash } from "@medusajs/icons"
import { Product, SalesChannel } from "@medusajs/medusa"
import { Button, Checkbox, Container, Heading, usePrompt } from "@medusajs/ui"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import {
  adminProductKeys,
  useAdminDeleteProductsFromSalesChannel,
  useAdminProducts,
} from "medusa-react"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { DataTable } from "../../../../../components/table/data-table"
import { useProductTableColumns } from "../../../../../hooks/table/columns/use-product-table-columns"
import { useProductTableFilters } from "../../../../../hooks/table/filters/use-product-table-filters"
import { useProductTableQuery } from "../../../../../hooks/table/query/use-product-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { queryClient } from "../../../../../lib/medusa"

const PAGE_SIZE = 10

type SalesChannelProductSectionProps = {
  salesChannel: SalesChannel
}

export const SalesChannelProductSection = ({
  salesChannel,
}: SalesChannelProductSectionProps) => {
  const { searchParams, raw } = useProductTableQuery({ pageSize: PAGE_SIZE })
  const { products, count, isLoading, isError, error } = useAdminProducts(
    {
      ...searchParams,
      sales_channel_id: [salesChannel.id],
    },
    {
      keepPreviousData: true,
    }
  )

  const filters = useProductTableFilters(["sales_channel_id"])
  const columns = useColumnsWithActions({ salesChannel })

  const { table } = useDataTable({
    data: (products ?? []) as Product[],
    columns,
    enablePagination: true,
    enableRowSelection: true,
    getRowId: (row) => row.id,
    count,
    pageSize: PAGE_SIZE,
  })

  const { t } = useTranslation()
  const { handleRemoveProducts } = useRemoveProducts({ salesChannel })

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
      <DataTable
        columns={columns}
        table={table}
        pagination
        navigateTo={(row) => `/products/${row.original.id}`}
        filters={filters}
        count={count}
        search
        isLoading={isLoading}
        rowCount={PAGE_SIZE}
        orderBy={["title", "created_at", "updated_at"]}
        commands={[
          {
            action: handleRemoveProducts,
            label: t("general.remove"),
            shortcut: "r",
          },
        ]}
        queryObject={raw}
      />
    </Container>
  )
}

const columnHelper = createColumnHelper<Product>()

const useColumnsWithActions = ({
  salesChannel,
}: {
  salesChannel: SalesChannel
}) => {
  const columns = useProductTableColumns()

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
      ...columns,
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
          return (
            <ProductListCellActions
              product={row.original}
              salesChannel={salesChannel}
            />
          )
        },
      }),
    ],
    [columns, salesChannel]
  ) as ColumnDef<Product>[]
}

const ProductListCellActions = ({
  salesChannel,
  product,
}: {
  product: Product
  salesChannel: SalesChannel
}) => {
  const { t } = useTranslation()
  const { handleRemoveProducts } = useRemoveProducts({ salesChannel })

  const handleRemove = async () => {
    await handleRemoveProducts({ [product.id]: true })
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

const useRemoveProducts = ({
  salesChannel,
}: {
  salesChannel: SalesChannel
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()

  const { mutateAsync } = useAdminDeleteProductsFromSalesChannel(
    salesChannel.id
  )

  const handleRemoveProducts = async (selection: Record<string, boolean>) => {
    const ids = Object.keys(selection).map((k) => ({ id: k }))

    const result = await prompt({
      title: t("general.areYouSure"),
      description: t("salesChannels.removeProductsWarning", {
        count: ids.length,
        sales_channel: salesChannel.name,
      }),
      confirmText: t("general.delete"),
      cancelText: t("general.cancel"),
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
          queryClient.invalidateQueries(adminProductKeys.lists())
        },
      }
    )
  }

  return { handleRemoveProducts }
}
