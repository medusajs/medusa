import { PencilSquare, Trash } from "@medusajs/icons"
import { AdminProductCategoryResponse } from "@medusajs/types"
import { Button, Container, Heading, Text } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { Link } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { DataTable } from "../../../../../components/table/data-table"
import { useProductCategories } from "../../../../../hooks/api/categories"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { useDeleteProductCategoryAction } from "../../../common/hooks/use-delete-product-category-action"
import { useCategoryTableColumns } from "./use-category-table-columns"
import { useCategoryTableQuery } from "./use-category-table-query"

const PAGE_SIZE = 20

export const CategoryListTable = () => {
  const { t } = useTranslation()

  const { raw, searchParams } = useCategoryTableQuery({ pageSize: PAGE_SIZE })

  const query = raw.q
    ? {
        include_ancestors_tree: true,
        fields: "id,name,handle,is_active,is_internal,parent_category",
        ...searchParams,
      }
    : {
        include_descendants_tree: true,
        parent_category_id: "null",
        fields: "id,name,category_children,handle,is_internal,is_active",
        ...searchParams,
      }

  const { product_categories, count, isLoading, isError, error } =
    useProductCategories(
      {
        ...query,
      },
      {
        placeholderData: keepPreviousData,
      }
    )

  const columns = useColumns()

  const { table } = useDataTable({
    data: product_categories || [],
    columns,
    count,
    getRowId: (original) => original.id,
    getSubRows: (original) => original.category_children,
    enableExpandableRows: true,
    pageSize: PAGE_SIZE,
  })

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading>{t("categories.domain")}</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            {t("categories.subtitle")}
          </Text>
        </div>
        <div className="flex items-center gap-x-2">
          <Button size="small" variant="secondary" asChild>
            <Link to="organize">{t("categories.organize.action")}</Link>
          </Button>
          <Button size="small" variant="secondary" asChild>
            <Link to="create">{t("actions.create")}</Link>
          </Button>
        </div>
      </div>
      <DataTable
        table={table}
        columns={columns}
        count={count}
        pageSize={PAGE_SIZE}
        isLoading={isLoading}
        navigateTo={(row) => row.id}
        queryObject={raw}
        search
        pagination
      />
    </Container>
  )
}

const CategoryRowActions = ({
  category,
}: {
  category: AdminProductCategoryResponse["product_category"]
}) => {
  const { t } = useTranslation()
  const handleDelete = useDeleteProductCategoryAction(category)

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              label: t("actions.edit"),
              icon: <PencilSquare />,
              to: `${category.id}/edit`,
            },
          ],
        },
        {
          actions: [
            {
              label: t("actions.delete"),
              icon: <Trash />,
              onClick: handleDelete,
            },
          ],
        },
      ]}
    />
  )
}

const columnHelper =
  createColumnHelper<AdminProductCategoryResponse["product_category"]>()

const useColumns = () => {
  const base = useCategoryTableColumns()

  return useMemo(
    () => [
      ...base,
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
          return <CategoryRowActions category={row.original} />
        },
      }),
    ],
    [base]
  )
}
