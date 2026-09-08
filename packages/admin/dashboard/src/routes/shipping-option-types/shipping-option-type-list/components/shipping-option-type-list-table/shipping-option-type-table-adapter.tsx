import { HttpTypes } from "@medusajs/types"
import { TFunction } from "i18next"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useShippingOptionTypes } from "../../../../../hooks/api"
import {
  createTableAdapter,
  TableAdapter,
} from "../../../../../lib/table/table-adapters"
import { ShippingOptionTypeRowActions } from "./shipping-option-type-table-row-actions"

export function createShippingOptionTypeTableAdapter({
  t,
}: {
  t: TFunction<"translation", undefined>
}): TableAdapter<HttpTypes.AdminShippingOptionType> {
  return createTableAdapter<HttpTypes.AdminShippingOptionType>({
    entity: "shipping-option-types",
    queryPrefix: "sot",
    pageSize: 20,
    emptyState: {
      empty: { heading: t("general.noRecordsMessage") },
      filtered: {
        heading: t("general.noRecordsMessage"),
        description: t("general.noRecordsMessageFiltered"),
      },
    },
    useData: (fields, params) => {
      const { shipping_option_types, count, isError, error, isLoading } =
        useShippingOptionTypes(
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
      return { data: shipping_option_types, count, isLoading, isError, error }
    },
    getRowHref: (row) => `${row.id}`,
    renderRowActions: (row) => (
      <ShippingOptionTypeRowActions shippingOptionType={row} />
    ),
    transformColumns: (columns) => {
      const ALLOWED_FILTERS = [
        "id",
        "label",
        "code",
        "description",
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
export function useShippingOptionTypeTableAdapter(): TableAdapter<HttpTypes.AdminShippingOptionType> {
  const { t } = useTranslation()
  return useMemo(() => createShippingOptionTypeTableAdapter({ t }), [t])
}
