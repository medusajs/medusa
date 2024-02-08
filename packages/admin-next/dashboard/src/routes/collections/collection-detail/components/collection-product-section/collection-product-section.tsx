import { PencilSquare, Trash } from "@medusajs/icons"
import type { Product, ProductCollection } from "@medusajs/medusa"
import { Button, Checkbox, Container, Heading, usePrompt } from "@medusajs/ui"
import { createColumnHelper } from "@tanstack/react-table"
import {
  adminProductKeys,
  useAdminProducts,
  useAdminRemoveProductsFromCollection,
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

type CollectionProductSectionProps = {
  collection: ProductCollection
}

const PAGE_SIZE = 10

export const CollectionProductSection = ({
  collection,
}: CollectionProductSectionProps) => {
  const { t } = useTranslation()

  const { searchParams, raw } = useProductTableQuery({ pageSize: PAGE_SIZE })
  const { products, count, isLoading, isError, error } = useAdminProducts(
    {
      limit: PAGE_SIZE,
      ...searchParams,
      collection_id: [collection.id],
    },
    {
      keepPreviousData: true,
    }
  )

  const filters = useProductTableFilters(["collections"])
  const columns = useColumns()

  const { table } = useDataTable({
    data: (products ?? []) as Product[],
    columns,
    getRowId: (row) => row.id,
    count,
    enablePagination: true,
    enableRowSelection: true,
    pageSize: PAGE_SIZE,
    meta: {
      collectionId: collection.id,
    },
  })

  const prompt = usePrompt()
  const { mutateAsync } = useAdminRemoveProductsFromCollection(collection.id)

  const handleRemove = async (selection: Record<string, boolean>) => {
    const ids = Object.keys(selection)

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
        <Link to={`/collections/${collection.id}/add-products`}>
          <Button size="small" variant="secondary">
            {t("general.add")}
          </Button>
        </Link>
      </div>
      <DataTable
        table={table}
        columns={columns}
        search
        pagination
        rowCount={PAGE_SIZE}
        navigateTo={({ original }) => `/products/${original.id}`}
        count={count}
        filters={filters}
        isLoading={isLoading}
        orderBy={["title", "created_at", "updated_at"]}
        queryObject={raw}
        commands={[
          {
            action: handleRemove,
            label: t("general.remove"),
            shortcut: "r",
          },
        ]}
      />
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
    [columns]
  )
}
