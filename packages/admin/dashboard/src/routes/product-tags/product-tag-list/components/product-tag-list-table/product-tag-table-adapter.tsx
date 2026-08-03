import { HttpTypes } from "@medusajs/types"
import { TFunction } from "i18next"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useProductTags } from "../../../../../hooks/api"
import {
  createTableAdapter,
  TableAdapter,
} from "../../../../../lib/table/table-adapters"
import { ProductTagListTableActions } from "./product-tag-list-table-actions"

export function createProductTagTableAdapter({
  t,
}: {
  t: TFunction<"translation", undefined>
}): TableAdapter<HttpTypes.AdminProductTag> {
  return createTableAdapter<HttpTypes.AdminProductTag>({
    entity: "product-tags",
    queryPrefix: "ptag",
    pageSize: 20,
    emptyState: {
      empty: { heading: t("general.noRecordsMessage") },
      filtered: {
        heading: t("general.noRecordsMessage"),
        description: t("general.noRecordsMessageFiltered"),
      },
    },
    useData: (fields, params) => {
      const { product_tags, count, isError, error, isLoading } = useProductTags(
        { fields, ...params },
        {
          placeholderData: (previousData, previousQuery: any) => {
            const prevFields =
              previousQuery?.[previousQuery?.length - 1]?.query?.fields
            if (prevFields && prevFields !== fields) {
              return undefined
            }
            return previousData
          },
        }
      )
      return { data: product_tags, count, isLoading, isError, error }
    },
    getRowHref: (row) => `/settings/product-tags/${row.id}`,
    renderRowActions: (row) => <ProductTagListTableActions productTag={row} />,
    transformColumns: (columns) => {
      const ALLOWED_FILTERS = [
        "id",
        "value",
        "external_id",
        "created_at",
        "updated_at",
        "deleted_at",
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
export function useProductTagTableAdapter(): TableAdapter<HttpTypes.AdminProductTag> {
  const { t } = useTranslation()
  return useMemo(() => createProductTagTableAdapter({ t }), [t])
}
