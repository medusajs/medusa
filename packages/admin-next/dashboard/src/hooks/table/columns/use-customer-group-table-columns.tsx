import { CustomerGroup } from "@medusajs/medusa"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { Text } from "@medusajs/ui"

import { NameHeader } from "../../../components/table/table-cells/common/name-cell"
import {
  CreatedAtHeader,
  CreatedAtCell,
} from "../../../components/table/table-cells/common/created-at-cell"

const columnHelper = createColumnHelper<CustomerGroup>()

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
