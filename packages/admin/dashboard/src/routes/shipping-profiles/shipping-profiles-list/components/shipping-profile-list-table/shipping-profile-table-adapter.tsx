import { HttpTypes } from "@medusajs/types"
import { TFunction } from "i18next"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useShippingProfiles } from "../../../../../hooks/api/shipping-profiles"
import {
  createTableAdapter,
  TableAdapter,
} from "../../../../../lib/table/table-adapters"
import { ShippingOptionsRowActions } from "./shipping-options-row-actions"

type ShippingProfile =
  HttpTypes.AdminShippingProfileResponse["shipping_profile"]

export function createShippingProfileTableAdapter({
  t,
}: {
  t: TFunction<"translation", undefined>
}): TableAdapter<ShippingProfile> {
  return createTableAdapter<ShippingProfile>({
    entity: "shipping-profiles",
    queryPrefix: "sp",
    pageSize: 20,
    emptyState: {
      empty: { heading: t("general.noRecordsMessage") },
      filtered: {
        heading: t("general.noRecordsMessage"),
        description: t("general.noRecordsMessageFiltered"),
      },
    },
    useData: (fields, params) => {
      const { shipping_profiles, count, isError, error, isLoading } =
        useShippingProfiles(
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
      return { data: shipping_profiles, count, isLoading, isError, error }
    },
    getRowHref: (row) => `/settings/shipping-profiles/${row.id}`,
    renderRowActions: (row) => <ShippingOptionsRowActions profile={row} />,
    transformColumns: (columns) => {
      const ALLOWED_FILTERS = [
        "id",
        "name",
        "type",
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
export function useShippingProfileTableAdapter(): TableAdapter<ShippingProfile> {
  const { t } = useTranslation()
  return useMemo(() => createShippingProfileTableAdapter({ t }), [t])
}
