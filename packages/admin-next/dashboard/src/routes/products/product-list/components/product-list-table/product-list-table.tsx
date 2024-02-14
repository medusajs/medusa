import { PencilSquare, Trash } from "@medusajs/icons"
import type { Product } from "@medusajs/medusa"
import { Button, Container, Heading, usePrompt } from "@medusajs/ui"
import { createColumnHelper } from "@tanstack/react-table"
import { useAdminDeleteProduct, useAdminProducts } from "medusa-react"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useLoaderData } from "react-router-dom"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { DataTable } from "../../../../../components/table/data-table"
import { useProductTableColumns } from "../../../../../hooks/table/columns/use-product-table-columns"
import { useProductTableFilters } from "../../../../../hooks/table/filters/use-product-table-filters"
import { useProductTableQuery } from "../../../../../hooks/table/query/use-product-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { productsLoader } from "../../loader"

const PAGE_SIZE = 20

export const ProductListTable = () => {
  const { t } = useTranslation()

  const initialData = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof productsLoader>>
  >

  const { searchParams, raw } = useProductTableQuery({ pageSize: PAGE_SIZE })
  const { products, count, isLoading, isError, error } = useAdminProducts(
    {
      ...searchParams,
    },
    {
      initialData,
    }
  )

  const filters = useProductTableFilters()
  const columns = useColumns()

  const { table } = useDataTable({
    data: (products ?? []) as Product[],
    columns,
    count,
    enablePagination: true,
    pageSize: PAGE_SIZE,
    getRowId: (row) => row.id,
  })

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("products.domain")}</Heading>
        <Button size="small" variant="secondary">
          {t("actions.create")}
        </Button>
      </div>
      <DataTable
        table={table}
        columns={columns}
        count={count}
        pageSize={PAGE_SIZE}
        filters={filters}
        search
        pagination
        isLoading={isLoading}
        queryObject={raw}
        navigateTo={(row) => `/products/${row.original.id}`}
        orderBy={["title", "created_at", "updated_at"]}
      />
    </Container>
  )
}

const ProductActions = ({ product }: { product: Product }) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const { mutateAsync } = useAdminDeleteProduct(product.id)

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("products.deleteWarning", {
        title: product.title,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
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
              icon: <PencilSquare />,
              label: t("actions.edit"),
              to: `/products/${product.id}/edit`,
            },
          ],
        },
        {
          actions: [
            {
              icon: <Trash />,
              label: t("actions.delete"),
              onClick: handleDelete,
            },
          ],
        },
      ]}
    />
  )
}

const columnHelper = createColumnHelper<Product>()

const useColumns = () => {
  const base = useProductTableColumns()

  const columns = useMemo(
    () => [
      ...base,
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
          return <ProductActions product={row.original} />
        },
      }),
    ],
    [base]
  )

  return columns
}
