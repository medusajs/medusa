import {
  Container,
  createDataTableColumnHelper,
  toast,
  usePrompt,
  Checkbox,
} from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { keepPreviousData } from "@tanstack/react-query"
import { useCallback, useEffect, useMemo, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { useNavigate, useSearchParams } from "react-router-dom"
import { PencilSquare, Trash } from "@medusajs/icons"

import {
  useDeleteProductOptionLazy,
  useProductOptions,
  useDeleteProductOptions,
} from "../../../../../hooks/api/product-options"
import { useProductOptionTableColumns } from "../../../../../hooks/table/columns/use-product-option-table-columns"
import { useProductOptionTableQuery } from "../../../../../hooks/table/query/use-product-option-table-query"
import { useProductOptionTableFilters } from "../../../../../hooks/table/filters"
import { DataTable } from "../../../../../components/data-table"

const PAGE_SIZE = 20
const DEFAULT_IS_EXCLUSIVE_FILTER = JSON.stringify("false")

export const ProductOptionListTable = () => {
  const { t } = useTranslation()
  const [urlSearchParams, setUrlSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const hasExclusiveFilter = urlSearchParams.has("is_exclusive")
  const [hasInitialized, setHasInitialized] = useState(hasExclusiveFilter)
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (hasInitialized) {
      return
    }

    if (hasExclusiveFilter) {
      setHasInitialized(true)
      return
    }

    const nextParams = new URLSearchParams(urlSearchParams)
    nextParams.set("is_exclusive", DEFAULT_IS_EXCLUSIVE_FILTER)
    setUrlSearchParams(nextParams, { replace: true })
  }, [hasInitialized, hasExclusiveFilter, urlSearchParams, setUrlSearchParams])

  const { searchParams } = useProductOptionTableQuery({
    pageSize: PAGE_SIZE,
  })

  const { product_options, count, isError, error, isLoading } =
    useProductOptions(searchParams, {
      placeholderData: keepPreviousData,
      enabled: hasInitialized,
    })

  const filters = useProductOptionTableFilters()
  const columns = useColumns()
  const commands = useCommands(setRowSelection)
  const handleCreate = useCallback(() => {
    const params = urlSearchParams.toString()
    navigate("create", {
      state: params ? { restore_params: params } : undefined,
    })
  }, [navigate, urlSearchParams])

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <DataTable
        data={product_options}
        columns={columns}
        filters={filters} // show filter bar ...
        enableFilterMenu={false} // hide filter with search bar so we don't render duplicates
        rowCount={count}
        pageSize={PAGE_SIZE}
        getRowId={(row) => row.id}
        heading={t("productOptions.domain")}
        subHeading={t("productOptions.subtitle")}
        emptyState={{
          empty: {
            heading: t("general.noRecordsMessage"),
          },
          filtered: {
            heading: t("general.noRecordsMessage"),
            description: t("general.noRecordsMessageFiltered"),
          },
        }}
        actions={[
          {
            label: t("actions.create"),
            onClick: handleCreate,
          },
        ]}
        isLoading={isLoading}
        enableSearch={true}
        rowSelection={{
          state: rowSelection,
          onRowSelectionChange: setRowSelection,
          enableRowSelection: true,
        }}
        commands={commands}
        rowHref={(row) => `/product-options/${row.id}`}
      />
    </Container>
  )
}

const useCommands = (
  setRowSelection: (value: Record<string, boolean>) => void
) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const { mutateAsync } = useDeleteProductOptions()

  const handleDelete = async (selection: Record<string, boolean>) => {
    const keys = Object.keys(selection)
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("productOptions.deleteWarningBatch", {
        count: keys.length,
        defaultValue: keys.length === 1 
          ? `You are about to delete 1 product option. This action cannot be undone.`
          : `You are about to delete ${keys.length} product options. This action cannot be undone.`,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync(keys, {
      onSuccess: () => {
        toast.success(
          t("productOptions.toasts.delete.success.header", {
            defaultValue: "Product options deleted",
          }),
          {
            description: t(
              "productOptions.toasts.delete.success.descriptionBatch",
              {
                count: keys.length,
                defaultValue: keys.length === 1 
                  ? `Successfully deleted 1 product option.`
                  : `Successfully deleted ${keys.length} product options.`,
              }
            ),
          }
        )
        setRowSelection({})
      },
      onError: (e) => {
        toast.error(
          t("productOptions.toasts.delete.error.header", {
            defaultValue: "Failed to delete product options",
          }),
          {
            description: e.message,
          }
        )
      },
    })
  }

  return [
    {
      action: handleDelete,
      shortcut: "d",
      label: t("actions.delete"),
      icon: <Trash />,
    },
  ]
}

const columnHelper = createDataTableColumnHelper<HttpTypes.AdminProductOption>()

const useColumns = () => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const navigate = useNavigate()
  const base = useProductOptionTableColumns()

  const { mutateAsync } = useDeleteProductOptionLazy()

  const handleDelete = useCallback(
    async (productOption: HttpTypes.AdminProductOption) => {
      const confirm = await prompt({
        title: t("general.areYouSure"),
        description: t("productOptions.delete.confirmation", {
          title: productOption.title,
        }),
        confirmText: t("actions.delete"),
        cancelText: t("actions.cancel"),
      })

      if (!confirm) {
        return
      }

      await mutateAsync(productOption.id, {
        onSuccess: () => {
          toast.success(t("productOptions.delete.successToast"))
        },
        onError: (e) => {
          toast.error(e.message)
        },
      })
    },
    [t, prompt, mutateAsync]
  )

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
      columnHelper.action({
        actions: (ctx) => [
          [
            {
              icon: <PencilSquare />,
              label: t("actions.edit"),
              onClick: () =>
                navigate(`/product-options/${ctx.row.original.id}/edit`),
            },
          ],
          [
            {
              icon: <Trash />,
              label: t("actions.delete"),
              onClick: () => handleDelete(ctx.row.original),
            },
          ],
        ],
      }),
    ],
    [base, handleDelete, navigate, t]
  )
}
