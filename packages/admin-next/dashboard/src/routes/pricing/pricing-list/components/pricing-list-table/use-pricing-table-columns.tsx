import { PriceList } from "@medusajs/medusa"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { StatusCell } from "../../../../../components/table/table-cells/common/status-cell"
import { getPriceListStatus } from "../../../common/utils"
import { PricingTableActions } from "./pricing-table-actions"

const columnHelper = createColumnHelper<PriceList>()

export const usePricingTableColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("name", {
        header: t("fields.name"),
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("status", {
        header: t("fields.status"),
        cell: ({ row }) => {
          const { color, text } = getPriceListStatus(t, row.original)

          return <StatusCell color={color}>{text}</StatusCell>
        },
      }),
      columnHelper.accessor("customer_groups", {
        header: t("customerGroups.domain"),
        cell: (info) => info.getValue()?.length || "-",
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => <PricingTableActions priceList={row.original} />,
      }),
    ],
    [t]
  )
}
