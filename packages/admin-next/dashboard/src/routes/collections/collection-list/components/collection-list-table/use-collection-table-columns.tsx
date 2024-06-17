import { HttpTypes } from "@medusajs/types"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { CollectionRowActions } from "./collection-row-actions"

const columnHelper = createColumnHelper<HttpTypes.AdminCollection>()

export const useCollectionTableColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("title", {
        header: t("fields.title"),
      }),
      columnHelper.accessor("handle", {
        header: t("fields.handle"),
        cell: ({ getValue }) => `/${getValue()}`,
      }),
      columnHelper.accessor("products", {
        header: t("fields.products"),
        cell: ({ getValue }) => {
          const count = getValue()?.length

          return <span>{count || "-"}</span>
        },
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => <CollectionRowActions collection={row.original} />,
      }),
    ],
    [t]
  )
}
