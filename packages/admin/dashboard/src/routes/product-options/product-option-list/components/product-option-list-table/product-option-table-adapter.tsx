import { HttpTypes } from "@medusajs/types"
import { TFunction } from "i18next"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useProductOptions } from "../../../../../hooks/api/product-options"
import {
  createTableAdapter,
  TableAdapter,
} from "../../../../../lib/table/table-adapters"
import { ProductOptionListTableActions } from "./product-option-list-table-actions"
import "./product-option-table-renderers"

export function createProductOptionTableAdapter({
  t,
}: {
  t: TFunction<"translation", undefined>
}): TableAdapter<HttpTypes.AdminProductOption> {
  return createTableAdapter<HttpTypes.AdminProductOption>({
    entity: "product-options",
    queryPrefix: "po",
    pageSize: 20,
    defaultFilters: {
      is_exclusive: "false",
    },
    emptyState: {
      empty: {
        heading: t("general.noRecordsMessage"),
      },
      filtered: {
        heading: t("general.noRecordsMessage"),
        description: t("general.noRecordsMessageFiltered"),
      },
    },
    useData: (fields, params) => {
      const { product_options, count, isError, error, isLoading } =
        useProductOptions(
          {
            fields,
            ...params,
          },
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
      return { data: product_options, count, isLoading, isError, error }
    },
    getRowHref: (row) => `/product-options/${row.id}`,
    renderRowActions: (row) => (
      <ProductOptionListTableActions productOption={row} />
    ),
    transformColumns: (columns) => {
      const ALLOWED_FILTERS = [
        "id",
        "title",
        "is_exclusive",
        "created_at",
        "updated_at",
        "deleted_at",
      ]

      return columns.map((column) => {
        const isFilterDisabled = !ALLOWED_FILTERS.includes(column.field)

        return {
          ...column,
          filter: isFilterDisabled
            ? { ...column.filter, enabled: false }
            : column.filter,
        }
      })
    },
  })
}

// eslint-disable-next-line max-len
export function useProductOptionTableAdapter(): TableAdapter<HttpTypes.AdminProductOption> {
  const { t } = useTranslation()
  return useMemo(() => createProductOptionTableAdapter({ t }), [t])
}
