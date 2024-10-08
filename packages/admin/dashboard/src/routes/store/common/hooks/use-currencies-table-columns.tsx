import { HttpTypes } from "@medusajs/types"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import {
  TextCell,
  TextHeader,
} from "../../../../components/table/table-cells/common/text-cell"

const columnHelper = createColumnHelper<HttpTypes.AdminCurrency>()

export const useCurrenciesTableColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("code", {
        header: () => <TextHeader text={t("fields.code")} />,
        cell: ({ getValue }) => <TextCell text={getValue().toUpperCase()} />,
      }),
      columnHelper.accessor("name", {
        header: () => <TextHeader text={t("fields.name")} />,
        cell: ({ getValue }) => <TextCell text={getValue()} />,
      }),
    ],
    [t]
  )
}
