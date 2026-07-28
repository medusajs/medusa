import { AdminPromotion } from "@medusajs/types"
import { TFunction } from "i18next"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { usePromotions } from "../../../../../hooks/api/promotions"
import {
  createTableAdapter,
  TableAdapter,
} from "../../../../../lib/table/table-adapters"
import { PromotionListTableActions } from "./promotion-list-table-actions"
import "./promotion-list-table-renderers"

export function createPromotionTableAdapter({
  t,
}: {
  t: TFunction<"translation", undefined>
}): TableAdapter<AdminPromotion> {
  return createTableAdapter<AdminPromotion>({
    entity: "promotions",
    queryPrefix: "promo",
    pageSize: 20,
    emptyState: {
      empty: {
        heading: t("promotions.list.empty.heading"),
        description: t("promotions.list.empty.description"),
      },
      filtered: {
        heading: t("promotions.list.filtered.heading"),
        description: t("promotions.list.filtered.description"),
      },
    },
    useData: (fields, params) => {
      const { promotions, count, isError, error, isLoading } = usePromotions(
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
        data: promotions as AdminPromotion[] | undefined,
        count,
        isLoading,
        isError,
        error,
      }
    },
    getRowHref: (row) => `/promotions/${row.id}`,
    renderRowActions: (row) => <PromotionListTableActions promotion={row} />,
    transformColumns: (columns) => {
      const ALLOWED_FILTERS = [
        "id",
        "code",
        "campaign.id",
        "application_method.currency_code",
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
export function usePromotionTableAdapter(): TableAdapter<AdminPromotion> {
  const { t } = useTranslation()
  return useMemo(() => createPromotionTableAdapter({ t }), [t])
}
