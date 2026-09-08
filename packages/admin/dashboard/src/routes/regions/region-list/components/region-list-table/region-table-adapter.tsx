import type { HttpTypes } from "@medusajs/types"
import { TFunction } from "i18next"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useRegions } from "../../../../../hooks/api/regions"
import {
  createTableAdapter,
  TableAdapter,
} from "../../../../../lib/table/table-adapters"
import { RegionListTableActions } from "./region-list-table-actions"
import "./region-list-table-renderers"

export function createRegionTableAdapter({
  t,
}: {
  t: TFunction<"translation", undefined>
}): TableAdapter<HttpTypes.AdminRegion> {
  return createTableAdapter<HttpTypes.AdminRegion>({
    entity: "regions",
    queryPrefix: "reg",
    pageSize: 20,
    emptyState: {
      empty: {
        heading: t("regions.list.empty.heading"),
        description: t("regions.list.empty.description"),
      },
      filtered: {
        heading: t("regions.list.filtered.heading"),
        description: t("regions.list.filtered.description"),
      },
    },
    useData: (fields, params) => {
      const { regions, count, isError, error, isLoading } = useRegions(
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
      return {
        data: regions as HttpTypes.AdminRegion[] | undefined,
        count,
        isLoading,
        isError,
        error,
      }
    },
    getRowHref: (row) => `/settings/regions/${row.id}`,
    renderRowActions: (row) => <RegionListTableActions region={row} />,
    transformColumns: (columns) => {
      const ALLOWED_FILTERS = [
        "id",
        "name",
        "currency_code",
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
export function useRegionTableAdapter(): TableAdapter<HttpTypes.AdminRegion> {
  const { t } = useTranslation()
  return useMemo(() => createRegionTableAdapter({ t }), [t])
}
