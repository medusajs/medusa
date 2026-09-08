import { HttpTypes } from "@medusajs/types"
import { TFunction } from "i18next"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useRefundReasons } from "../../../../../hooks/api"
import {
  createTableAdapter,
  TableAdapter,
} from "../../../../../lib/table/table-adapters"
import { RefundReasonListTableActions } from "./refund-reason-list-table-actions"

export function createRefundReasonTableAdapter({
  t,
}: {
  t: TFunction<"translation", undefined>
}): TableAdapter<HttpTypes.AdminRefundReason> {
  return createTableAdapter<HttpTypes.AdminRefundReason>({
    entity: "refund-reasons",
    queryPrefix: "rfr",
    pageSize: 20,
    emptyState: {
      empty: { heading: t("general.noRecordsMessage") },
      filtered: {
        heading: t("general.noRecordsMessage"),
        description: t("general.noRecordsMessageFiltered"),
      },
    },
    useData: (fields, params) => {
      const { refund_reasons, count, isError, error, isLoading } =
        useRefundReasons(
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
      return { data: refund_reasons, count, isLoading, isError, error }
    },
    getRowHref: (row) => `/settings/refund-reasons/${row.id}`,
    renderRowActions: (row) => (
      <RefundReasonListTableActions refundReason={row} />
    ),
    transformColumns: (columns) => {
      const ALLOWED_FILTERS = ["id", "created_at", "updated_at", "deleted_at"]
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
export function useRefundReasonTableAdapter(): TableAdapter<HttpTypes.AdminRefundReason> {
  const { t } = useTranslation()
  return useMemo(() => createRefundReasonTableAdapter({ t }), [t])
}
