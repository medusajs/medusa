import { GlobeEurope, PencilSquare, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Button, Container, Heading } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { createColumnHelper, RowSelectionState } from "@tanstack/react-table"
import { useMemo, useState, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { Link, useLoaderData } from "react-router-dom"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { _DataTable } from "../../../../../components/table/data-table"
import { useProductTags, useDeleteProductTags } from "../../../../../hooks/api"
import { DataTableRowSelectionState, toast, usePrompt, Checkbox } from "@medusajs/ui"
import { useProductTagTableColumns } from "../../../../../hooks/table/columns"
import { useProductTagTableFilters } from "../../../../../hooks/table/filters"
import { useProductTagTableQuery } from "../../../../../hooks/table/query"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { useDeleteProductTagAction } from "../../../common/hooks/use-delete-product-tag-action"
import { productTagListLoader } from "../../loader"
import { useFeatureFlag } from "../../../../../providers/feature-flag-provider"

const PAGE_SIZE = 20

export const ProductTagListTable = () => {
  const { t } = useTranslation()
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const { searchParams, raw } = useProductTagTableQuery({
    pageSize: PAGE_SIZE,
  })

  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof productTagListLoader>
  >

  const { product_tags, count, isPending, isError, error } = useProductTags(
    searchParams,
    {
      initialData,
      placeholderData: keepPreviousData,
    }
  )

  const columns = useColumns()
  const filters = useProductTagTableFilters()
  const commands = useCommands(setRowSelection)

  const { table } = useDataTable({
    data: product_tags,
    count,
    columns,
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
    enableRowSelection: true,
    rowSelection: {
      state: rowSelection,
      updater: setRowSelection,
    },
  })

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y px-0 py-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{t("productTags.domain")}</Heading>
        <Button variant="secondary" size="small" asChild>
          <Link to="create">{t("actions.create")}</Link>
        </Button>
      </div>
      <_DataTable
        table={table}
        filters={filters}
        queryObject={raw}
        isLoading={isPending}
        columns={columns}
        pageSize={PAGE_SIZE}
        commands={commands}
        count={count}
        navigateTo={(row) => row.original.id}
        search
        pagination
        orderBy={[
          { key: "value", label: t("fields.value") },
          { key: "created_at", label: t("fields.createdAt") },
          { key: "updated_at", label: t("fields.updatedAt") },
        ]}
      />
    </Container>
  )
}

const ProductTagRowActions = ({
  productTag,
}: {
  productTag: HttpTypes.AdminProductTag
}) => {
  const { t } = useTranslation()
  const handleDelete = useDeleteProductTagAction({ productTag })
  const isTranslationsEnabled = useFeatureFlag("translation")

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: <PencilSquare />,
              label: t("actions.edit"),
              to: `${productTag.id}/edit`,
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
                    to: `/settings/translations/edit?reference=product_tag&reference_id=${productTag.id}`,
                  },
                ],
              },
            ]
          : []),
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

const columnHelper = createColumnHelper<HttpTypes.AdminProductTag>()

const useColumns = () => {
  const base = useProductTagTableColumns()

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
        cell: ({ row }) => <ProductTagRowActions productTag={row.original} />,
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
  const { mutateAsync } = useDeleteProductTags()

  const handleDelete = useCallback(
    async (rowSelection: DataTableRowSelectionState) => {
      const keys = Object.keys(rowSelection)

      const res = await prompt({
        title: t("general.areYouSure"),
        description: t("productTags.deleteWarningBatch" as any, {
          count: keys.length,
          defaultValue: keys.length === 1
            ? `You are about to delete 1 product tag. This action cannot be undone.`
            : `You are about to delete ${keys.length} product tags. This action cannot be undone.`,
        }),
        confirmText: t("actions.delete"),
        cancelText: t("actions.cancel"),
      })

      if (!res) {
        return Promise.resolve()
      }

      await mutateAsync(keys, {
        onSuccess: () => {
          toast.success(t("productTags.toasts.delete.success.header" as any), {
            description: t(
              "productTags.toasts.delete.success.descriptionBatch" as any,
              {
                count: keys.length,
                defaultValue: keys.length === 1
                  ? `Successfully deleted 1 product tag.`
                  : `Successfully deleted ${keys.length} product tags.`,
              }
            ),
          })
          setRowSelection({})
        },
        onError: (err) => {
          toast.error(t("productTags.toasts.delete.error.header" as any), {
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
