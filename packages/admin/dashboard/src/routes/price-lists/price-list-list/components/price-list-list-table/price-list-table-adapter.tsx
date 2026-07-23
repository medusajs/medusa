import { HttpTypes } from "@medusajs/types"
import { TFunction } from "i18next"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { usePriceLists } from "../../../../../hooks/api/price-lists"
import {
  createTableAdapter,
  TableAdapter,
} from "../../../../../lib/table/table-adapters"
import { PriceListListTableActions } from "./price-list-list-table-actions"
import "./price-list-table-renderers"

export function createPriceListTableAdapter({
  t,
}: {
  t: TFunction<"translation", undefined>
}): TableAdapter<HttpTypes.AdminPriceList> {
  return createTableAdapter<HttpTypes.AdminPriceList>({
    entity: "price-lists",
    queryPrefix: "pl",
    pageSize: 20,
    emptyState: {
      empty: {
        heading: t("priceLists.list.empty.heading"),
        description: t("priceLists.list.empty.description"),
      },
      filtered: {
        heading: t("priceLists.list.filtered.heading"),
        description: t("priceLists.list.filtered.description"),
      },
    },
    useData: (fields, params) => {
      const { price_lists, count, isError, error, isLoading } = usePriceLists(
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
      return { data: price_lists, count, isLoading, isError, error }
    },
    getRowHref: (row) => `/price-lists/${row.id}`,
    renderRowActions: (row) => <PriceListListTableActions priceList={row} />,
    transformColumns: (columns) => {
      // Mirrors AdminGetPriceListsParamsFields on the admin price lists list
      // endpoint.
      const ALLOWED_FILTERS = [
        "id",
        "status",
        "starts_at",
        "ends_at",
        "rules_count",
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
export function usePriceListTableAdapter(): TableAdapter<HttpTypes.AdminPriceList> {
  const { t } = useTranslation()
  return useMemo(() => createPriceListTableAdapter({ t }), [t])
}
