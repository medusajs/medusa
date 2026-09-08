import { HttpTypes } from "@medusajs/types"
import { DataTableCommand, toast, usePrompt } from "@medusajs/ui"
import { TFunction } from "i18next"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useUpdateCollectionProducts } from "../../../../../hooks/api/collections"
import { useProducts } from "../../../../../hooks/api/products"
import {
  createTableAdapter,
  TableAdapter,
} from "../../../../../lib/table/table-adapters"
import { CollectionProductRowActions } from "./collection-product-row-actions"

export function createCollectionProductTableAdapter({
  t,
  collectionId,
  commands,
}: {
  t: TFunction<"translation", undefined>
  collectionId: string
  commands: DataTableCommand[]
}): TableAdapter<HttpTypes.AdminProduct> {
  return createTableAdapter<HttpTypes.AdminProduct>({
    entity: "products",
    viewConfigurationKey: "products-collection",
    queryPrefix: "cp",
    pageSize: 10,
    enableRowSelection: true,
    commands,
    emptyState: {
      empty: { heading: t("collections.products.list.noRecordsMessage") },
      filtered: {
        heading: t("general.noRecordsMessage"),
        description: t("general.noRecordsMessageFiltered"),
      },
    },
    useData: (fields, params) => {
      const { products, count, isError, error, isLoading } = useProducts(
        {
          fields,
          ...params,
          collection_id: [collectionId],
        },
        {
          placeholderData: (previousData: any, previousQuery: any) => {
            const prevFields =
              previousQuery?.[previousQuery?.length - 1]?.query?.fields
            if (prevFields && prevFields !== fields) {
              return undefined
            }
            return previousData
          },
        }
      )
      return { data: products, count, isLoading, isError, error }
    },
    getRowHref: (row) => `/products/${row.id}`,
    renderRowActions: (row) => (
      <CollectionProductRowActions product={row} collectionId={collectionId} />
    ),
    transformColumns: (columns) => {
      const ALLOWED_FILTERS = [
        "id",
        "title",
        "handle",
        "status",
        "external_id",
        "created_at",
        "updated_at",
        "deleted_at",
        "type.id",
        "tags.id",
        "categories.id",
        "sales_channels.id",
        "variants.id",
      ]
      return columns.map((column) => ({
        ...column,
        filter: !ALLOWED_FILTERS.includes(column.field)
          ? { ...column.filter, enabled: false }
          : column.filter,
      }))
    },
  })
}

// eslint-disable-next-line max-len
export function useCollectionProductTableAdapter(
  collectionId: string
): TableAdapter<HttpTypes.AdminProduct> {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const { mutateAsync } = useUpdateCollectionProducts(collectionId)

  const commands = useMemo<DataTableCommand[]>(
    () => [
      {
        label: t("actions.remove"),
        shortcut: "r",
        action: async (selection) => {
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
            { remove: ids },
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
        },
      },
    ],
    [t, prompt, mutateAsync]
  )

  return useMemo(
    () => createCollectionProductTableAdapter({ t, collectionId, commands }),
    [t, collectionId, commands]
  )
}
