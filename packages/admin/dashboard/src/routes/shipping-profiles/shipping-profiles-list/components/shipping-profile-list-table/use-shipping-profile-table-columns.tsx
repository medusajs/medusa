import { AdminShippingProfileResponse } from "@medusajs/types"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { ShippingOptionsRowActions } from "./shipping-options-row-actions"
import { useShippingProfilePermissions } from "../../../../../hooks/use-resource-permissions"

const columnHelper =
  createColumnHelper<AdminShippingProfileResponse["shipping_profile"]>()

export const useShippingProfileTableColumns = () => {
  const { t } = useTranslation()
  const { canDelete } = useShippingProfilePermissions()

  return useMemo(
    () => [
      columnHelper.accessor("name", {
        header: t("fields.name"),
        cell: (cell) => cell.getValue(),
      }),
      columnHelper.accessor("type", {
        header: t("fields.type"),
        cell: (cell) => cell.getValue(),
      }),
      ...(canDelete
        ? [
            columnHelper.display({
              id: "actions",
              cell: ({ row }) => (
                <ShippingOptionsRowActions profile={row.original} />
              ),
            }),
          ]
        : []),
    ],
    [t, canDelete]
  )
}
