import { useMemo } from "react"

import { AdminShippingOptionTypeResponse } from "@medusajs/types"
import { createColumnHelper } from "@tanstack/react-table"
import { useTranslation } from "react-i18next"

import { ShippingOptionsRowActions } from "./shipping-options-row-actions"

const columnHelper =
  createColumnHelper<AdminShippingOptionTypeResponse["shipping_option_type"]>()

export const useShippingOptionTypeTableColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("label", {
        header: t("fields.label"),
        cell: (cell) => cell.getValue(),
      }),
      columnHelper.accessor("code", {
        header: t("fields.code"),
        cell: (cell) => cell.getValue(),
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => (
          <ShippingOptionsRowActions optionType={row.original} />
        ),
      }),
    ],
    [t]
  )
}
