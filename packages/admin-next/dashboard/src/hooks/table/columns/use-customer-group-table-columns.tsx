import { Text } from "@medusajs/ui"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"

import { AdminCustomerGroupResponse } from "@medusajs/types"
import {
  CreatedAtCell,
  CreatedAtHeader,
} from "../../../components/table/table-cells/common/created-at-cell"
import { NameHeader } from "../../../components/table/table-cells/common/name-cell"

const columnHelper =
  createColumnHelper<AdminCustomerGroupResponse["customer_group"]>()

export const useCustomerGroupTableColumns = () => {
  return useMemo(
    () => [
      columnHelper.display({
        id: "name",
        header: () => <NameHeader />,
        cell: ({
          row: {
            original: { name },
          },
        }) => <Text size="small">{name}</Text>,
      }),

      columnHelper.accessor("created_at", {
        header: () => <CreatedAtHeader />,
        cell: ({ getValue }) => <CreatedAtCell date={getValue()} />,
      }),
    ],
    []
  )
}
