import { HttpTypes } from "@medusajs/types"
import { createDataTableColumnHelper } from "@medusajs/ui"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { DataTableStatusCell } from "../../../components/data-table/components/data-table-status-cell/data-table-status-cell"
import { PencilSquare } from "@medusajs/icons"
import { useNavigate, useSearchParams } from "react-router-dom"

const columnHelper = createDataTableColumnHelper<HttpTypes.AdminEntityInfo>()

export const usePropertyLabelsTableColumns = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  return useMemo(
    () => [
      columnHelper.accessor("module", {
        header: () => t("propertyLabels.fields.module"),
        enableSorting: true,
        sortLabel: t("propertyLabels.fields.module"),
        sortAscLabel: t("filters.sorting.alphabeticallyAsc"),
        sortDescLabel: t("filters.sorting.alphabeticallyDesc"),
      }),
      columnHelper.accessor("name", {
        header: () => t("propertyLabels.fields.model"),
        enableSorting: true,
        sortLabel: t("propertyLabels.fields.model"),
        sortAscLabel: t("filters.sorting.alphabeticallyAsc"),
        sortDescLabel: t("filters.sorting.alphabeticallyDesc"),
      }),
      columnHelper.accessor("propertyCount", {
        header: () => t("propertyLabels.fields.propertyCount"),
      }),
      columnHelper.accessor("hasOverrides", {
        header: () => t("propertyLabels.fields.hasOverrides"),
        cell: ({ getValue }) => {
          const value = getValue()
          return (
            <DataTableStatusCell color={value ? "green" : "grey"}>
              {value ? t("filters.radio.yes") : t("filters.radio.no")}
            </DataTableStatusCell>
          )
        },
      }),
      columnHelper.action({
        actions: (ctx) => [
          {
            label: t("actions.edit"),
            icon: <PencilSquare />,
            onClick: () => {
              const params = searchParams.toString()
              navigate(
                `/settings/property-labels/${ctx.row.original.name}/edit`,
                params ? { state: { restore_params: params } } : undefined
              )
            },
          },
        ],
      }),
    ],
    [t, navigate, searchParams]
  )
}
