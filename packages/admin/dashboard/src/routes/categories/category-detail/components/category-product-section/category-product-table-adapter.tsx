import { HttpTypes } from "@medusajs/types"
import { DataTableCommand, toast, usePrompt } from "@medusajs/ui"
import { TFunction } from "i18next"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useUpdateProductCategoryProducts } from "../../../../../hooks/api/categories"
import { useProducts } from "../../../../../hooks/api/products"
import {
  createTableAdapter,
  TableAdapter,
} from "../../../../../lib/table/table-adapters"

const PRODUCT_ALLOWED_FILTERS_BASE = [
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
  "sales_channels.id",
  "variants.id",
]

export function createCategoryProductTableAdapter({
  t,
  categoryId,
  commands,
}: {
  t: TFunction<"translation", undefined>
  categoryId: string
  commands: DataTableCommand[]
}): TableAdapter<HttpTypes.AdminProduct> {
  return createTableAdapter<HttpTypes.AdminProduct>({
    entity: "products",
    viewConfigurationKey: "products-category",
    queryPrefix: "catp",
    pageSize: 10,
    enableRowSelection: true,
    commands,
    emptyState: {
      empty: { heading: t("categories.products.list.noRecordsMessage") },
      filtered: {
        heading: t("general.noRecordsMessage"),
        description: t("general.noRecordsMessageFiltered"),
      },
    },
    useData: (fields, params) => {
      const { products, count, isError, error, isLoading } = useProducts(
        { fields, ...params, category_id: [categoryId] },
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
    transformColumns: (columns) =>
      columns.map((column) => ({
        ...column,
        filter: !PRODUCT_ALLOWED_FILTERS_BASE.includes(column.field)
          ? { ...column.filter, enabled: false }
          : column.filter,
      })),
  })
}

// eslint-disable-next-line max-len
export function useCategoryProductTableAdapter(
  categoryId: string
): TableAdapter<HttpTypes.AdminProduct> {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const { mutateAsync } = useUpdateProductCategoryProducts(categoryId)

  const commands = useMemo<DataTableCommand[]>(
    () => [
      {
        label: t("actions.remove"),
        shortcut: "r",
        action: async (selection) => {
          const ids = Object.keys(selection)
          const res = await prompt({
            title: t("general.areYouSure"),
            description: t("categories.products.remove.confirmation", {
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
                  t("categories.products.remove.successToast", {
                    count: ids.length,
                  })
                )
              },
              onError: (e) => toast.error(e.message),
            }
          )
        },
      },
    ],
    [t, prompt, mutateAsync]
  )

  return useMemo(
    () => createCategoryProductTableAdapter({ t, categoryId, commands }),
    [t, categoryId, commands]
  )
}
