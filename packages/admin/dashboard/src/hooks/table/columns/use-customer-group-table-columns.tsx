import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"

import { useTranslation } from "react-i18next"
import {
  TextCell,
  TextHeader,
} from "../../../components/table/table-cells/common/text-cell"
import { HttpTypes } from "@medusajs/types"

const columnHelper = createColumnHelper<HttpTypes.AdminCustomerGroup>()

export const useCustomerGroupTableColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("name", {
        header: () => <TextHeader text={t("fields.name")} />,
        cell: ({ getValue }) => <TextCell text={getValue() || "-"} />,
      }),
      columnHelper.accessor("customers", {
        header: () => <TextHeader text={t("customers.domain")} />,
        cell: ({ getValue }) => {
          const count = getValue()?.length ?? 0

          return <TextCell text={count} />
        },
      }),
    ],
    [t]
  )
}
