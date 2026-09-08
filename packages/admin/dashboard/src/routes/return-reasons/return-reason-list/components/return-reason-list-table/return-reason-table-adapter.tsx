import { HttpTypes } from "@medusajs/types"
import { TFunction } from "i18next"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useReturnReasons } from "../../../../../hooks/api/return-reasons"
import {
  createTableAdapter,
  TableAdapter,
} from "../../../../../lib/table/table-adapters"
import { ReturnReasonListTableActions } from "./return-reason-list-table-actions"

export function createReturnReasonTableAdapter({
  t,
}: {
  t: TFunction<"translation", undefined>
}): TableAdapter<HttpTypes.AdminReturnReason> {
  return createTableAdapter<HttpTypes.AdminReturnReason>({
    entity: "return-reasons",
    queryPrefix: "rr",
    pageSize: 20,
    emptyState: {
      empty: { heading: t("general.noRecordsMessage") },
      filtered: {
        heading: t("general.noRecordsMessage"),
        description: t("general.noRecordsMessageFiltered"),
      },
    },
    useData: (fields, params) => {
      const { return_reasons, count, isError, error, isLoading } =
        useReturnReasons(
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
      return { data: return_reasons, count, isLoading, isError, error }
    },
    getRowHref: (row) => `/settings/return-reasons/${row.id}`,
    renderRowActions: (row) => (
      <ReturnReasonListTableActions returnReason={row} />
    ),
    transformColumns: (columns) => {
      const ALLOWED_FILTERS = [
        "id",
        "value",
        "label",
        "description",
        "parent_return_reason_id",
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
export function useReturnReasonTableAdapter(): TableAdapter<HttpTypes.AdminReturnReason> {
  const { t } = useTranslation()
  return useMemo(() => createReturnReasonTableAdapter({ t }), [t])
}
