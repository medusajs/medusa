import { AdminCustomerGroupResponse } from "@medusajs/types"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { CustomerGroupRowActions } from "./customer-group-row-actions"

const columnHelper =
  createColumnHelper<AdminCustomerGroupResponse["customer_group"]>()

export const useCustomerGroupTableColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("name", {
        header: t("fields.name"),
        cell: ({ getValue }) => getValue(),
      }),
      columnHelper.accessor("customers", {
        header: t("customers.domain"),
        cell: ({ getValue }) => {
          const count = getValue()?.length ?? 0

          return count
        },
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => <CustomerGroupRowActions group={row.original} />,
      }),
    ],
    [t]
  )
}
