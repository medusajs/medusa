import { PencilSquare, Plus, Trash } from "@medusajs/icons"
import { Product, ProductCategory } from "@medusajs/medusa"
import { Checkbox, Container, Heading, usePrompt } from "@medusajs/ui"
import { RowSelectionState, createColumnHelper } from "@tanstack/react-table"
import {
  adminProductKeys,
  useAdminDeleteProductsFromCategory,
  useAdminProducts,
} from "medusa-react"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../../components/common/action-menu"
import { DataTable } from "../../../../../../components/table/data-table"
import { useProductTableColumns } from "../../../../../../hooks/table/columns/use-product-table-columns"
import { useProductTableFilters } from "../../../../../../hooks/table/filters/use-product-table-filters"
import { useProductTableQuery } from "../../../../../../hooks/table/query/use-product-table-query"
import { useDataTable } from "../../../../../../hooks/use-data-table"
import { queryClient } from "../../../../../../lib/medusa"

type CategoryProductsSectionProps = {
  category: ProductCategory
}

const PAGE_SIZE = 10
const PREFIX = "p"

export const CategoryProductsSection = ({
  category,
}: CategoryProductsSectionProps) => {
  const { t } = useTranslation()
  const prompt = usePrompt()

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const { searchParams, raw } = useProductTableQuery({
    pageSize: PAGE_SIZE,
    prefix: PREFIX,
  })
  const { products, count, isLoading, isError, error } = useAdminProducts(
    {
      ...searchParams,
      category_id: [category.id],
    },
    {
      keepPreviousData: true,
    }
  )

  const { mutateAsync } = useAdminDeleteProductsFromCategory(category.id)

  const handleRemoveProducts = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("categories.removeProductsWarning", {
        count: Object.keys(rowSelection).length,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync(
      {
        product_ids: Object.keys(rowSelection).map((k) => ({ id: k })),
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(adminProductKeys.lists())
          setRowSelection({})
        },
      }
    )
  }

  const columns = useColumns()
  const filters = useProductTableFilters(["categories"])

  const { table } = useDataTable({
    data: (products || []) as Product[],
    columns,
    count,
    enablePagination: true,
    enableRowSelection: true,
    rowSelection: {
      state: rowSelection,
      updater: setRowSelection,
    },
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
    prefix: PREFIX,
    meta: { categoryId: category.id },
  })

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("products.domain")}</Heading>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  label: t("categories.products.addProductsLabel"),
                  to: "add-products",
                  icon: <Plus />,
                },
              ],
            },
          ]}
        />
      </div>
      <DataTable
        table={table}
        columns={columns}
        pageSize={PAGE_SIZE}
        prefix={PREFIX}
        filters={filters}
        orderBy={["title", "created_at", "updated_at"]}
        count={count}
        isLoading={isLoading}
        queryObject={raw}
        commands={[
          {
            action: handleRemoveProducts,
            label: t("actions.remove"),
            shortcut: "r",
          },
        ]}
        pagination
        search
        navigateTo={({ original }) => `/products/${original.id}`}
      />
    </Container>
  )
}

const ProductActions = ({
  product,
  categoryId,
}: {
  product: Product
  categoryId: string
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()

  const { mutateAsync } = useAdminDeleteProductsFromCategory(categoryId)

  const handleRemove = async () => {
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

    await mutateAsync(
      {
        product_ids: [{ id: product.id }],
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(adminProductKeys.lists())
        },
      }
    )
  }

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: <PencilSquare />,
              label: t("actions.edit"),
              to: `/products/${product.id}`,
            },
          ],
        },
        {
          actions: [
            {
              icon: <Trash />,
              label: t("actions.remove"),
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
      ...base,
      columnHelper.display({
        id: "actions",
        cell: ({ row, table }) => {
          const { categoryId } = table.options.meta as { categoryId: string }

          return (
            <ProductActions product={row.original} categoryId={categoryId} />
          )
        },
      }),
    ],
    [base]
  )
}
