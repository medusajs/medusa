import { HttpTypes } from "@zjedene-medusa/types"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { DateCell } from "../../../components/table/table-cells/common/date-cell"
import { TextCell } from "../../../components/table/table-cells/common/text-cell"

const columnHelper = createColumnHelper<HttpTypes.AdminShippingOptionType>()

export const useShippingOptionTypeTableColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("label", {
        header: () => t("fields.label"),
        cell: ({ getValue }) => <TextCell text={getValue()} />,
      }),
      columnHelper.accessor("code", {
        header: () => t("fields.code"),
        cell: ({ getValue }) => <TextCell text={getValue()} />,
      }),
      columnHelper.accessor("description", {
        header: () => t("fields.description"),
        cell: ({ getValue }) => <TextCell text={getValue()} />,
      }),
      columnHelper.accessor("created_at", {
        header: () => t("fields.createdAt"),

        cell: ({ getValue }) => {
          return <DateCell date={getValue()} />
        },
      }),
      columnHelper.accessor("updated_at", {
        header: () => t("fields.updatedAt"),
        cell: ({ getValue }) => {
          return <DateCell date={getValue()} />
        },
      }),
    ],
    [t]
  )
}
