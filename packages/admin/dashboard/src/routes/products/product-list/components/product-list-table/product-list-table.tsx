import { GlobeEurope, PencilSquare, Trash } from "@medusajs/icons"
import { Button, Container, Heading, toast, usePrompt, Checkbox } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { createColumnHelper } from "@tanstack/react-table"
import { useState, useMemo, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { Link, Outlet, useLoaderData, useLocation } from "react-router-dom"

import { HttpTypes } from "@medusajs/types"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { _DataTable } from "../../../../../components/table/data-table"
import {
  useDeleteProduct,
  useDeleteProducts,
  useProducts,
} from "../../../../../hooks/api/products"
import { useProductTableColumns } from "../../../../../hooks/table/columns/use-product-table-columns"
import { useProductTableFilters } from "../../../../../hooks/table/filters/use-product-table-filters"
import { useProductTableQuery } from "../../../../../hooks/table/query/use-product-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { productsLoader } from "../../loader"
import { useFeatureFlag } from "../../../../../providers/feature-flag-provider"
import { RowSelectionState } from "@tanstack/react-table"
import { DataTableRowSelectionState } from "@medusajs/ui"

const PAGE_SIZE = 20

export const ProductListTable = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const initialData = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof productsLoader>>
  >

  const { searchParams, raw } = useProductTableQuery({ pageSize: PAGE_SIZE })
  const { products, count, isLoading, isError, error } = useProducts(
    {
      ...searchParams,
      is_giftcard: false,
    },
    {
      initialData,
      placeholderData: keepPreviousData,
    }
  )

  const filters = useProductTableFilters()
  const columns = useColumns()
  const commands = useCommands(setRowSelection)

  const { table } = useDataTable({
    data: (products ?? []) as HttpTypes.AdminProduct[],
    columns,
    count,
    enablePagination: true,
    pageSize: PAGE_SIZE,
    getRowId: (row) => row.id,
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
        <Heading level="h1">{t("products.domain")}</Heading>
        <div className="flex items-center justify-center gap-x-2">
          <Button size="small" variant="secondary" asChild>
            <Link to={`export${location.search}`}>{t("actions.export")}</Link>
          </Button>
          <Button size="small" variant="secondary" asChild>
            <Link to={`import${location.search}`}>{t("actions.import")}</Link>
          </Button>
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
        filters={filters}
        search
        pagination
        isLoading={isLoading}
        queryObject={raw}
        navigateTo={(row) => `${row.original.id}`}
        orderBy={[
          { key: "title", label: t("fields.title") },
          { key: "created_at", label: t("fields.createdAt") },
          { key: "updated_at", label: t("fields.updatedAt") },
        ]}
        noRecords={{
          message: t("products.list.noRecordsMessage"),
        }}
      />
      <Outlet />
    </Container>
  )
}

const ProductActions = ({ product }: { product: HttpTypes.AdminProduct }) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const { mutateAsync } = useDeleteProduct(product.id)
  const isTranslationsEnabled = useFeatureFlag("translation")

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

    await mutateAsync(undefined, {
      onSuccess: () => {
        toast.success(t("products.toasts.delete.success.header"), {
          description: t("products.toasts.delete.success.description", {
            title: product.title,
          }),
        })
      },
      onError: (e) => {
        toast.error(t("products.toasts.delete.error.header"), {
          description: e.message,
        })
      },
    })
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
        ...(isTranslationsEnabled
          ? [
              {
                actions: [
                  {
                    icon: <GlobeEurope />,
                    label: t("translations.actions.manage"),
                    to: `/settings/translations/edit?reference=product&reference_id=${product.id}`,
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

const columnHelper = createColumnHelper<HttpTypes.AdminProduct>()

const useColumns = () => {
  const base = useProductTableColumns()

  const columns = useMemo(
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
          return <ProductActions product={row.original} />
        },
      }),
    ],
    [base]
  )

  return columns
}

const useCommands = (
  setRowSelection: (state: DataTableRowSelectionState) => void
) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const { mutateAsync } = useDeleteProducts()

  const handleDelete = useCallback(
    async (rowSelection: DataTableRowSelectionState) => {
      const keys = Object.keys(rowSelection)

      const res = await prompt({
        title: t("general.areYouSure"),
        description: t("products.deleteWarningBatch" as any, {
          count: keys.length,
          defaultValue: keys.length === 1
            ? `You are about to delete 1 product. This action cannot be undone.`
            : `You are about to delete ${keys.length} products. This action cannot be undone.`,
        }),
        confirmText: t("actions.delete"),
        cancelText: t("actions.cancel"),
      })

      if (!res) {
        return Promise.resolve()
      }

      await mutateAsync(keys, {
        onSuccess: () => {
          toast.success(t("products.toasts.delete.success.header" as any), {
            description: t(
              "products.toasts.delete.success.descriptionBatch" as any,
              {
                count: keys.length,
                defaultValue: keys.length === 1
                  ? `Successfully deleted 1 product.`
                  : `Successfully deleted ${keys.length} products.`,
              }
            ),
          })
          setRowSelection({})
        },
        onError: (err) => {
          toast.error(t("products.toasts.delete.error.header" as any), {
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
