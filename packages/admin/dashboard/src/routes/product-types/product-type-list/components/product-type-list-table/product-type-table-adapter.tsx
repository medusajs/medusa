import { HttpTypes } from "@medusajs/types"
import { TFunction } from "i18next"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useProductTypes } from "../../../../../hooks/api/product-types"
import {
  createTableAdapter,
  TableAdapter,
} from "../../../../../lib/table/table-adapters"
import { ProductTypeRowActions } from "./product-table-row-actions"

export function createProductTypeTableAdapter({
  t,
}: {
  t: TFunction<"translation", undefined>
}): TableAdapter<HttpTypes.AdminProductType> {
  return createTableAdapter<HttpTypes.AdminProductType>({
    entity: "product-types",
    queryPrefix: "pt",
    pageSize: 20,
    emptyState: {
      empty: { heading: t("general.noRecordsMessage") },
      filtered: {
        heading: t("general.noRecordsMessage"),
        description: t("general.noRecordsMessageFiltered"),
      },
    },
    useData: (fields, params) => {
      const { product_types, count, isError, error, isLoading } =
        useProductTypes(
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
      return { data: product_types, count, isLoading, isError, error }
    },
    getRowHref: (row) => `/settings/product-types/${row.id}`,
    renderRowActions: (row) => <ProductTypeRowActions productType={row} />,
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
export function useProductTypeTableAdapter(): TableAdapter<HttpTypes.AdminProductType> {
  const { t } = useTranslation()
  return useMemo(() => createProductTypeTableAdapter({ t }), [t])
}
