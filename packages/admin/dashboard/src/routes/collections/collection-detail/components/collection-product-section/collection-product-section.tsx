import { PencilSquare, Plus, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Checkbox, Container, Heading, toast, usePrompt } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import {
  ActionGroup,
  ActionMenu,
} from "../../../../../components/common/action-menu"
import { _DataTable } from "../../../../../components/table/data-table"
import { useUpdateCollectionProducts } from "../../../../../hooks/api/collections"
import { useProducts } from "../../../../../hooks/api/products"
import { useProductTableColumns } from "../../../../../hooks/table/columns/use-product-table-columns"
import { useProductTableFilters } from "../../../../../hooks/table/filters/use-product-table-filters"
import { useProductTableQuery } from "../../../../../hooks/table/query/use-product-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { useProductPermissions } from "../../../../../hooks/use-resource-permissions"
import { usePermissions } from "../../../../../providers/permissions-provider"

type CollectionProductSectionProps = {
  collection: HttpTypes.AdminCollection
}

const PAGE_SIZE = 10

export const CollectionProductSection = ({
  collection,
}: CollectionProductSectionProps) => {
  const { t } = useTranslation()
  const { hasAllPermissions } = usePermissions()
  const { canUpdate: canUpdateProducts } = useProductPermissions()

  const canManageCollectionProducts = hasAllPermissions([
    "product:update",
    "product_collection:update",
  ])

  const { searchParams, raw } = useProductTableQuery({ pageSize: PAGE_SIZE })
  const { products, count, isLoading, isError, error } = useProducts(
    {
      limit: PAGE_SIZE,
      ...searchParams,
      collection_id: [collection.id!],
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  const filters = useProductTableFilters(["collections"])
  const columns = useColumns({ canManageCollectionProducts })

  const { table } = useDataTable({
    data: products ?? [],
    columns,
    getRowId: (row) => row.id,
    count,
    enablePagination: true,
    enableRowSelection: canUpdateProducts,
    pageSize: PAGE_SIZE,
    meta: {
      collectionId: collection.id,
    },
  })

  const prompt = usePrompt()

  const { mutateAsync } = useUpdateCollectionProducts(collection.id!)

  const handleRemove = async (selection: Record<string, boolean>) => {
    const ids = Object.keys(selection)

    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("collections.removeProductsWarning", {
        count: ids.length,
      }),
      confirmText: t("actions.remove"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync(
      {
        remove: ids,
      },
      {
        onSuccess: () => {
          toast.success(
            t("collections.products.remove.successToast", {
              count: ids.length,
            })
          )
        },
        onError: (e) => {
          toast.error(e.message)
        },
      }
    )
  }

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("products.domain")}</Heading>
        {canManageCollectionProducts && (
          <ActionMenu
            groups={[
              {
                actions: [
                  {
                    icon: <Plus />,
                    label: t("actions.add"),
                    to: "products",
                  },
                ],
              },
            ]}
          />
        )}
      </div>
      <_DataTable
        table={table}
        columns={columns}
        search
        pagination
        pageSize={PAGE_SIZE}
        navigateTo={({ original }) => `/products/${original.id}`}
        count={count}
        filters={filters}
        isLoading={isLoading}
        orderBy={[
          { key: "title", label: t("fields.title") },
          { key: "created_at", label: t("fields.createdAt") },
          { key: "updated_at", label: t("fields.updatedAt") },
        ]}
        queryObject={raw}
        commands={
          canManageCollectionProducts
            ? [
                {
                  action: handleRemove,
                  label: t("actions.remove"),
                  shortcut: "r",
                },
              ]
            : []
        }
        noRecords={{
          message: t("collections.products.list.noRecordsMessage"),
        }}
      />
    </Container>
  )
}

const ProductActions = ({
  product,
  collectionId,
}: {
  product: HttpTypes.AdminProduct
  collectionId: string
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const { hasAllPermissions } = usePermissions()
  const { canUpdate: canEditProduct } = useProductPermissions()
  const { mutateAsync } = useUpdateCollectionProducts(collectionId)

  const canManageCollectionProducts = hasAllPermissions([
    "product:update",
    "product_collection:update",
  ])

  const handleRemove = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("collections.removeSingleProductWarning", {
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
        remove: [product.id],
      },
      {
        onSuccess: () => {
          toast.success(
            t("collections.products.remove.successToast", {
              count: 1,
            })
          )
        },
        onError: (e) => {
          toast.error(e.message)
        },
      }
    )
  }

  const groups: ActionGroup[] = []

  if (canEditProduct) {
    groups.push({
      actions: [
        {
          icon: <PencilSquare />,
          label: t("actions.edit"),
          to: `/products/${product.id}/edit`,
        },
      ],
    })
  }

  if (canManageCollectionProducts) {
    groups.push({
      actions: [
        {
          icon: <Trash />,
          label: t("actions.remove"),
          onClick: handleRemove,
        },
      ],
    })
  }

  if (!groups.length) {
    return null
  }

  return <ActionMenu groups={groups} />
}

const columnHelper = createColumnHelper<HttpTypes.AdminProduct>()

const useColumns = ({
  canManageCollectionProducts,
}: {
  canManageCollectionProducts: boolean
}) => {
  const columns = useProductTableColumns()

  return useMemo(
    () => [
      ...(canManageCollectionProducts
        ? [
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
          ]
        : []),
      ...columns,
      columnHelper.display({
        id: "actions",
        cell: ({ row, table }) => {
          const { collectionId } = table.options.meta as {
            collectionId: string
          }

          return (
            <ProductActions
              product={row.original}
              collectionId={collectionId}
            />
          )
        },
      }),
    ],
    [columns, canManageCollectionProducts]
  )
}
