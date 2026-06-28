import { Button, Container, Heading, Text, toast, usePrompt, Checkbox } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import { HttpTypes } from "@medusajs/types"
import { keepPreviousData } from "@tanstack/react-query"
import { createColumnHelper, RowSelectionState } from "@tanstack/react-table"
import { useMemo, useState, useCallback } from "react"
import { _DataTable } from "../../../../../components/table/data-table"
import { useCollections, useDeleteCollections } from "../../../../../hooks/api/collections"
import { DataTableRowSelectionState } from "@medusajs/ui"
import { useCollectionTableColumns } from "../../../../../hooks/table/columns/use-collection-table-columns"
import { useCollectionTableFilters } from "../../../../../hooks/table/filters"
import { useCollectionTableQuery } from "../../../../../hooks/table/query"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { CollectionRowActions } from "./collection-row-actions"

const PAGE_SIZE = 20

export const CollectionListTable = () => {
  const { t } = useTranslation()
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const { searchParams, raw } = useCollectionTableQuery({ pageSize: PAGE_SIZE })
  const { collections, count, isError, error, isLoading } = useCollections(
    {
      ...searchParams,
      fields: "+products.id",
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  const filters = useCollectionTableFilters()
  const columns = useColumns()
  const commands = useCommands(setRowSelection)

  const { table } = useDataTable({
    data: collections ?? [],
    columns,
    count,
    enablePagination: true,
    getRowId: (row, index) => row.id ?? `${index}`,
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
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading>{t("collections.domain")}</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            {t("collections.subtitle")}
          </Text>
        </div>
        <Link to="/collections/create">
          <Button size="small" variant="secondary">
            {t("actions.create")}
          </Button>
        </Link>
      </div>
      <_DataTable
        table={table}
        columns={columns}
        pageSize={PAGE_SIZE}
        commands={commands}
        count={count}
        filters={filters}
        orderBy={[
          { key: "title", label: t("fields.title") },
          { key: "handle", label: t("fields.handle") },
          { key: "created_at", label: t("fields.createdAt") },
          { key: "updated_at", label: t("fields.updatedAt") },
        ]}
        search
        navigateTo={(row) => `/collections/${row.original.id}`}
        queryObject={raw}
        isLoading={isLoading}
      />
    </Container>
  )
}

const columnHelper = createColumnHelper<HttpTypes.AdminCollection>()

const useColumns = () => {
  const base = useCollectionTableColumns()

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
        cell: ({ row }) => <CollectionRowActions collection={row.original} />,
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
  const { mutateAsync } = useDeleteCollections()

  const handleDelete = useCallback(
    async (rowSelection: DataTableRowSelectionState) => {
      const keys = Object.keys(rowSelection)

      const res = await prompt({
        title: t("general.areYouSure"),
        description: t("collections.deleteWarningBatch" as any, {
          count: keys.length,
          defaultValue: keys.length === 1
            ? `You are about to delete 1 collection. This action cannot be undone.`
            : `You are about to delete ${keys.length} collections. This action cannot be undone.`,
        }),
        confirmText: t("actions.delete"),
        cancelText: t("actions.cancel"),
      })

      if (!res) {
        return Promise.resolve()
      }

      await mutateAsync(keys, {
        onSuccess: () => {
          toast.success(t("collections.toasts.delete.success.header" as any), {
            description: t(
              "collections.toasts.delete.success.descriptionBatch" as any,
              {
                count: keys.length,
                defaultValue: keys.length === 1
                  ? `Successfully deleted 1 collection.`
                  : `Successfully deleted ${keys.length} collections.`,
              }
            ),
          })
          setRowSelection({})
        },
        onError: (err) => {
          toast.error(t("collections.toasts.delete.error.header" as any), {
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
