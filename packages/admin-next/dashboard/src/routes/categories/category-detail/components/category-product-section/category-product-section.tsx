import { PencilSquare, Trash } from "@medusajs/icons"
import { Product, ProductCategory } from "@medusajs/medusa"
import { Container, Heading, usePrompt } from "@medusajs/ui"
import { createColumnHelper } from "@tanstack/react-table"
import {
  useAdminDeleteProductsFromCategory,
  useAdminProducts,
} from "medusa-react"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { DataTable } from "../../../../../components/table/data-table"
import { useProductTableColumns } from "../../../../../hooks/table/columns/use-product-table-columns"
import { useProductTableFilters } from "../../../../../hooks/table/filters/use-product-table-filters"
import { useProductTableQuery } from "../../../../../hooks/table/query/use-product-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"

type CategoryProductSectionProps = {
  category: ProductCategory
}

const PAGE_SIZE = 10

export const CategoryProductSection = ({
  category,
}: CategoryProductSectionProps) => {
  const { t } = useTranslation()

  const { searchParams, raw } = useProductTableQuery({ pageSize: PAGE_SIZE })
  const { products, count, isLoading, isError, error } = useAdminProducts({
    ...searchParams,
    category_id: [category.id],
  })

  const filters = useProductTableFilters(["categories"])
  const columns = useColumns()

  const { table } = useDataTable({
    data: (products ?? []) as Product[],
    columns,
    count,
    enablePagination: true,
    enableRowSelection: true,
    getRowId: (row) => row.id,
    meta: { category },
    pageSize: PAGE_SIZE,
  })

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("products.domain")}</Heading>
      </div>
      <DataTable
        table={table}
        columns={columns}
        rowCount={PAGE_SIZE}
        count={count}
        filters={filters}
        navigateTo={({ original }) => `/products/${original.id}`}
        pagination
        search
        queryObject={raw}
        isLoading={isLoading}
        orderBy={["title", "created_at", "updated_at"]}
      />
    </Container>
  )
}

const columnHelper = createColumnHelper<Product>()

const useColumns = () => {
  const base = useProductTableColumns()

  return useMemo(
    () => [
      ...base,
      columnHelper.display({
        id: "actions",
        cell: ({ row, table }) => {
          const product = row.original
          const { category } = table.options.meta as {
            category: ProductCategory
          }

          return <ProductActions category={category} product={product} />
        },
      }),
    ],
    [base]
  )
}

const ProductActions = ({
  category,
  product,
}: {
  category: ProductCategory
  product: Product
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const { mutateAsync } = useAdminDeleteProductsFromCategory(category.id)

  const handleRemoveProduct = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("categories.removeProductWarning", {
        title: product.title,
      }),
      confirmText: t("actions.remove"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync({ product_ids: [{ id: product.id }] })
  }

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              label: t("actions.edit"),
              to: `/products/${product.id}/edit`,
              icon: <PencilSquare />,
            },
          ],
        },
        {
          actions: [
            {
              label: t("actions.remove"),
              onClick: handleRemoveProduct,
              icon: <Trash />,
            },
          ],
        },
      ]}
    />
  )
}
