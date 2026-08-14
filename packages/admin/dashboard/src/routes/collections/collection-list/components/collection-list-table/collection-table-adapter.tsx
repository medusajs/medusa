import { HttpTypes } from "@medusajs/types"
import { TFunction } from "i18next"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useCollections } from "../../../../../hooks/api/collections"
import {
  createTableAdapter,
  TableAdapter,
} from "../../../../../lib/table/table-adapters"
import { CollectionRowActions } from "./collection-row-actions"

export function createCollectionTableAdapter({
  t,
}: {
  t: TFunction<"translation", undefined>
}): TableAdapter<HttpTypes.AdminCollection> {
  return createTableAdapter<HttpTypes.AdminCollection>({
    entity: "product-collections",
    queryPrefix: "col",
    pageSize: 20,
    emptyState: {
      empty: {
        heading: t("collections.list.empty.heading"),
        description: t("collections.list.empty.description"),
      },
      filtered: {
        heading: t("collections.list.filtered.heading"),
        description: t("collections.list.filtered.description"),
      },
    },
    useData: (fields, params) => {
      const { collections, count, isError, error, isLoading } = useCollections(
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
      return { data: collections, count, isLoading, isError, error }
    },
    getRowHref: (row) => `/collections/${row.id}`,
    renderRowActions: (row) => <CollectionRowActions collection={row} />,
    transformColumns: (columns) => {
      const ALLOWED_FILTERS = [
        "id",
        "title",
        "handle",
        "external_id",
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
export function useCollectionTableAdapter(): TableAdapter<HttpTypes.AdminCollection> {
  const { t } = useTranslation()
  return useMemo(() => createCollectionTableAdapter({ t }), [t])
}
