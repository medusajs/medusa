import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { ExtendedStockLocationDTO } from "../../../../../types/api-responses"
import { LocationRowActions } from "./location-row-actions"

const columnHelper = createColumnHelper<ExtendedStockLocationDTO>()

export const useLocationTableColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("name", {
        header: t("fields.name"),
        cell: (cell) => cell.getValue(),
      }),
      columnHelper.accessor("address", {
        header: t("fields.address"),
        cell: (cell) => {
          const value = cell.getValue()

          if (!value) {
            return "-"
          }

          return `${value.address_1}${value.city ? `, ${value.city}` : ""}`
        },
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => <LocationRowActions location={row.original} />,
      }),
    ],
    [t]
  )
}
