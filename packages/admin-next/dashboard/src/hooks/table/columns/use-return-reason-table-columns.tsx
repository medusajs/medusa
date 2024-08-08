import { HttpTypes } from "@medusajs/types"
import { Badge } from "@medusajs/ui"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

const columnHelper = createColumnHelper<HttpTypes.AdminReturnReason>()

export const useReturnReasonTableColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("value", {
        header: () => t("fields.value"),
        cell: ({ getValue }) => <Badge size="2xsmall">{getValue()}</Badge>,
      }),
      columnHelper.accessor("label", {
        header: () => t("fields.createdAt"),
        cell: ({ row }) => {
          const { label, description } = row.original
          return (
            <div className="flex h-full w-full flex-col justify-center">
              <span className="truncate font-medium">{label}</span>
              <span className="truncate">{description}</span>
            </div>
          )
        },
      }),
    ],
    [t]
  )
}
