import { PencilSquare, Trash } from "@medusajs/icons"
import { Product } from "@medusajs/medusa"
import { Button, Container, Heading, usePrompt } from "@medusajs/ui"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { useAdminDeleteProduct, useAdminProducts } from "medusa-react"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Link, useLoaderData } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { DataTable } from "../../../../../components/table/data-table"
import { useProductTableColumns } from "../../../../../hooks/table/columns/use-product-table-columns"
import { useProductTableFilters } from "../../../../../hooks/table/filters/use-product-table-filters"
import { useProductTableQuery } from "../../../../../hooks/table/query/use-product-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { productListLoader } from "../../loader"

const PAGE_SIZE = 20

export const ProductListTable = () => {
  const { t } = useTranslation()
  const { searchParams, raw } = useProductTableQuery({
    pageSize: PAGE_SIZE,
  })

  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof productListLoader>
  >

  const { products, count, isError, error, isLoading } = useAdminProducts(
    {
      ...searchParams,
    },
    {
      keepPreviousData: true,
      initialData,
    }
  )

  const filters = useProductTableFilters()
  const columns = useColumnsWithActions()

  const { table } = useDataTable({
    data: (products ?? []) as Product[],
    columns,
    enablePagination: true,
    count,
    pageSize: PAGE_SIZE,
  })

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{t("products.domain")}</Heading>
        <div className="flex items-center gap-x-2">
          <Button size="small" variant="secondary" asChild>
            <Link to="/products/create">{t("general.create")}</Link>
          </Button>
        </div>
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
        orderBy={["display_id", "created_at", "updated_at"]}
        queryObject={raw}
      />
    </Container>
  )
}

const ProductActions = ({ product }: { product: Product }) => {
  const { mutateAsync } = useAdminDeleteProduct(product.id)
  const { t } = useTranslation()
  const prompt = usePrompt()

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("products.deleteProductWarning", {
        title: product.title,
      }),
      confirmText: t("general.delete"),
      cancelText: t("general.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync()
  }

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              label: t("general.edit"),
              icon: <PencilSquare />,
              to: `/products/${product.id}/edit`,
            },
          ],
        },
        {
          actions: [
            {
              label: t("general.delete"),
              icon: <Trash />,
              onClick: handleDelete,
            },
          ],
        },
      ]}
    />
  )
}

const columnHelper = createColumnHelper<Product>()

const useColumnsWithActions = () => {
  const baseColumns = useProductTableColumns()

  return useMemo(
    () => [
      ...baseColumns,
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => <ProductActions product={row.original} />,
      }),
    ],
    [baseColumns]
  ) as ColumnDef<Product>[]
}
