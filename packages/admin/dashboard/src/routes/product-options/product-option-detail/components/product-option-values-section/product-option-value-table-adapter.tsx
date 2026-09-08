import { HttpTypes } from "@medusajs/types"
import { TFunction } from "i18next"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useProductOptionValues } from "../../../../../hooks/api"
import {
  createTableAdapter,
  TableAdapter,
} from "../../../../../lib/table/table-adapters"
import { ProductOptionValueRowActions } from "./product-option-value-row-actions"

export function createProductOptionValueTableAdapter({
  t,
  optionId,
}: {
  t: TFunction<"translation", undefined>
  optionId: string
}): TableAdapter<HttpTypes.AdminProductOptionValue> {
  return createTableAdapter<HttpTypes.AdminProductOptionValue>({
    entity: "product-option-values",
    queryPrefix: "optval",
    pageSize: 10,
    emptyState: {
      empty: {
        heading: t("general.noRecordsMessage"),
        description: t("productOptions.values.list.noRecords"),
      },
      filtered: {
        heading: t("general.noRecordsMessage"),
        description: t("general.noRecordsMessageFiltered"),
      },
    },
    useData: (fields, params) => {
      const { product_option_values, count, isError, error, isLoading } =
        useProductOptionValues(
          optionId,
          { fields, ...params },
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
      return { data: product_option_values, count, isLoading, isError, error }
    },
    getRowHref: (row) => `/product-options/${optionId}/values/${row.id}`,
    renderRowActions: (row) => (
      <ProductOptionValueRowActions optionId={optionId} value={row} />
    ),
    transformColumns: (columns) => {
      const ALLOWED_FILTERS = [
        "id",
        "value",
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
export function useProductOptionValueTableAdapter(
  optionId: string
): TableAdapter<HttpTypes.AdminProductOptionValue> {
  const { t } = useTranslation()
  return useMemo(
    () => createProductOptionValueTableAdapter({ t, optionId }),
    [t, optionId]
  )
}
