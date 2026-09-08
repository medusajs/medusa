import { HttpTypes } from "@medusajs/types"
import { TFunction } from "i18next"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useUsers } from "../../../../../hooks/api/users"
import {
  createTableAdapter,
  TableAdapter,
} from "../../../../../lib/table/table-adapters"
import { UserListTableActions } from "./user-list-table-actions"

export function createUserTableAdapter({
  t,
}: {
  t: TFunction<"translation", undefined>
}): TableAdapter<HttpTypes.AdminUser> {
  return createTableAdapter<HttpTypes.AdminUser>({
    entity: "users",
    queryPrefix: "u",
    pageSize: 20,
    emptyState: {
      empty: {
        heading: t("users.list.empty.heading"),
        description: t("users.list.empty.description"),
      },
      filtered: {
        heading: t("users.list.filtered.heading"),
        description: t("users.list.filtered.description"),
      },
    },
    useData: (fields, params) => {
      const { users, count, isError, error, isLoading } = useUsers(
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
      return { data: users, count, isLoading, isError, error }
    },
    getRowHref: (row) => `/settings/users/${row.id}`,
    renderRowActions: (row) => <UserListTableActions user={row} />,
    transformColumns: (columns) => {
      const ALLOWED_FILTERS = [
        "id",
        "email",
        "first_name",
        "last_name",
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
export function useUserTableAdapter(): TableAdapter<HttpTypes.AdminUser> {
  const { t } = useTranslation()
  return useMemo(() => createUserTableAdapter({ t }), [t])
}
