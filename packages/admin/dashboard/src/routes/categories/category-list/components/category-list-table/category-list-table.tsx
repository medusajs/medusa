import { GlobeEurope, PencilSquare, Trash } from "@medusajs/icons"
import { AdminProductCategoryResponse } from "@medusajs/types"
import { Button, Container, Heading, Text, toast, usePrompt, Checkbox } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { createColumnHelper, RowSelectionState } from "@tanstack/react-table"
import { useMemo, useState, useCallback } from "react"
import { useTranslation } from "react-i18next"

import { Link } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { _DataTable } from "../../../../../components/table/data-table"
import { useProductCategories, useDeleteProductCategories } from "../../../../../hooks/api/categories"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { DataTableRowSelectionState } from "@medusajs/ui"
import { useDeleteProductCategoryAction } from "../../../common/hooks/use-delete-product-category-action"
import { useCategoryTableColumns } from "./use-category-table-columns"
import { useCategoryTableQuery } from "./use-category-table-query"
import { useFeatureFlag } from "../../../../../providers/feature-flag-provider"

const PAGE_SIZE = 20

export const CategoryListTable = () => {
  const { t } = useTranslation()
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

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
  const commands = useCommands(setRowSelection)

  const { table } = useDataTable({
    data: product_categories || [],
    columns,
    count,
    getRowId: (original) => original.id,
    getSubRows: (original) => original.category_children,
    enableExpandableRows: true,
    pageSize: PAGE_SIZE,
    enableRowSelection: true,
    rowSelection: {
      state: rowSelection,
      updater: setRowSelection,
    },
  })

  const showRankingAction =
    !!product_categories && product_categories.length > 0

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
          {showRankingAction && (
            <Button size="small" variant="secondary" asChild>
              <Link to="organize">{t("categories.organize.action")}</Link>
            </Button>
          )}
          <Button size="small" variant="secondary" asChild>
            <Link to="create">{t("actions.create")}</Link>
          </Button>
        </div>
      </div>
      <_DataTable
        table={table}
        columns={columns}
        count={count}
        pageSize={PAGE_SIZE}
        commands={commands}
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
  const isTranslationsEnabled = useFeatureFlag("translation")
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
        ...(isTranslationsEnabled
          ? [
              {
                actions: [
                  {
                    icon: <GlobeEurope />,
                    label: t("translations.actions.manage"),
                    to: `/settings/translations/edit?reference=product_category&reference_id=${category.id}`,
                  },
                ],
              },
            ]
          : []),
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
        cell: ({ row }) => {
          return <CategoryRowActions category={row.original} />
        },
      }),
    ],
    [base]
  )
}

const useCommands = (
  setRowSelection: (state: DataTableRowSelectionState) => void
) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const { mutateAsync } = useDeleteProductCategories()

  const handleDelete = useCallback(
    async (rowSelection: DataTableRowSelectionState) => {
      const keys = Object.keys(rowSelection)

      const res = await prompt({
        title: t("general.areYouSure"),
        description: t("categories.deleteWarningBatch" as any, {
          count: keys.length,
          defaultValue: keys.length === 1
            ? `You are about to delete 1 category. This action cannot be undone.`
            : `You are about to delete ${keys.length} categories. This action cannot be undone.`,
        }),
        confirmText: t("actions.delete"),
        cancelText: t("actions.cancel"),
      })

      if (!res) {
        return Promise.resolve()
      }

      await mutateAsync(keys, {
        onSuccess: () => {
          toast.success(t("categories.toasts.delete.success.header" as any), {
            description: t(
              "categories.toasts.delete.success.descriptionBatch" as any,
              {
                count: keys.length,
                defaultValue: keys.length === 1
                  ? `Successfully deleted 1 category.`
                  : `Successfully deleted ${keys.length} categories.`,
              }
            ),
          })
          setRowSelection({})
        },
        onError: (err) => {
          toast.error(t("categories.toasts.delete.error.header" as any), {
            description: err.message,
          })
        },
      })
    },
    [mutateAsync, prompt, t, setRowSelection]
  )

  return useMemo(
    () => [
      {
        action: handleDelete,
        label: t("actions.delete"),
        shortcut: "d",
      },
    ],
    [handleDelete, t]
  )
}
