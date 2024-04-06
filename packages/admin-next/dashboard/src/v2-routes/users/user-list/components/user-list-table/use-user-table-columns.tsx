import { UserDTO } from "@medusajs/types"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { UserRowActions } from "./user-row-actions"

const columnHelper = createColumnHelper<UserDTO>()

export const useUserTableColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("email", {
        header: t("fields.email"),
        cell: ({ row }) => {
          return row.original.email
        },
      }),
      columnHelper.display({
        id: "name",
        header: t("fields.name"),
        cell: ({ row }) => {
          const name = [row.original.first_name, row.original.last_name]
            .filter(Boolean)
            .join(" ")

          if (!name) {
            return <span className="text-ui-fg-muted">-</span>
          }

          return name
        },
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => <UserRowActions user={row.original} />,
      }),
    ],
    [t]
  )
}
