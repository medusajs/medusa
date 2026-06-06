import { HttpTypes } from "@zjedene-medusa/types"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { createDataTableColumnHelper } from "@zjedene-medusa/ui"
import { DescriptionCell } from "../../../components/table/table-cells/sales-channel/description-cell"

const columnHelper = createDataTableColumnHelper<HttpTypes.AdminRefundReason>()

export const useRefundReasonTableColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("label", {
        header: () => t("fields.label"),
        enableSorting: true,
        sortLabel: t("fields.label"),
        sortAscLabel: t("filters.sorting.alphabeticallyAsc"),
        sortDescLabel: t("filters.sorting.alphabeticallyDesc"),
      }),
      columnHelper.accessor("code", {
        header: () => t("fields.code"),
        enableSorting: true,
        sortLabel: t("fields.code"),
        sortAscLabel: t("filters.sorting.alphabeticallyAsc"),
        sortDescLabel: t("filters.sorting.alphabeticallyDesc"),
      }),
      columnHelper.accessor("description", {
        header: () => t("fields.description"),
        cell: ({ getValue }) => <DescriptionCell description={getValue()} />,
        enableSorting: true,
        sortLabel: t("fields.description"),
        sortAscLabel: t("filters.sorting.alphabeticallyAsc"),
        sortDescLabel: t("filters.sorting.alphabeticallyDesc"),
      }),
    ],
    [t]
  )
}
