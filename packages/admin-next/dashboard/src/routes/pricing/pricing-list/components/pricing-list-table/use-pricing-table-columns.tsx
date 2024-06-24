import { HttpTypes } from "@medusajs/types"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { StatusCell } from "../../../../../components/table/table-cells/common/status-cell"
import {
  TextCell,
  TextHeader,
} from "../../../../../components/table/table-cells/common/text-cell"
import { getPriceListStatus } from "../../../common/utils"
import { PricingTableActions } from "./pricing-table-actions"

const columnHelper = createColumnHelper<HttpTypes.AdminPriceList>()

export const usePricingTableColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("title", {
        header: () => <TextHeader text={t("fields.title")} />,
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("status", {
        header: t("fields.status"),
        cell: ({ row }) => {
          const { color, text } = getPriceListStatus(t, row.original)

          return <StatusCell color={color}>{text}</StatusCell>
        },
      }),
      columnHelper.accessor("prices", {
        header: t("pricing.table.pricesHeader"),
        cell: (info) => <TextCell text={`${info.getValue()?.length || "-"}`} />,
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => <PricingTableActions priceList={row.original} />,
      }),
    ],
    [t]
  )
}
