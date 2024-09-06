import { createColumnHelper } from "@tanstack/react-table"

import { HttpTypes } from "@medusajs/types"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { StatusCell } from "../../../components/table/table-cells/common/status-cell"
import { TextHeader } from "../../../components/table/table-cells/common/text-cell"
import {
  DescriptionCell,
  DescriptionHeader,
} from "../../../components/table/table-cells/sales-channel/description-cell"
import {
  NameCell,
  NameHeader,
} from "../../../components/table/table-cells/sales-channel/name-cell"

const columnHelper = createColumnHelper<HttpTypes.AdminSalesChannel>()

export const useSalesChannelTableColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("name", {
        header: () => <NameHeader />,
        cell: ({ getValue }) => <NameCell name={getValue()} />,
      }),
      columnHelper.accessor("description", {
        header: () => <DescriptionHeader />,
        cell: ({ getValue }) => <DescriptionCell description={getValue()} />,
      }),
      columnHelper.accessor("is_disabled", {
        header: () => <TextHeader text={t("fields.status")} />,
        cell: ({ getValue }) => {
          const value = getValue()
          return (
            <StatusCell color={value ? "grey" : "green"}>
              {value ? t("general.disabled") : t("general.enabled")}
            </StatusCell>
          )
        },
      }),
    ],
    [t]
  )
}
