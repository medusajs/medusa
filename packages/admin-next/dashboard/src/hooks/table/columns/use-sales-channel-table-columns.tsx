import { SalesChannel } from "@medusajs/medusa"
import { createColumnHelper } from "@tanstack/react-table"

import { useMemo } from "react"
import {
  DescriptionCell,
  DescriptionHeader,
} from "../../../components/table/table-cells/sales-channel/description-cell"
import {
  NameCell,
  NameHeader,
} from "../../../components/table/table-cells/sales-channel/name-cell"

const columnHelper = createColumnHelper<SalesChannel>()

export const useSalesChannelTableColumns = () => {
  return useMemo(
    () => [
      columnHelper.accessor("name", {
        header: () => <NameHeader />,
        cell: ({ getValue }) => <NameCell name={getValue()} />,
      }),
      columnHelper.accessor("description", {
        header: () => <DescriptionHeader />,
        cell: ({ getValue }) => <DescriptionCell description={getValue()} />,
      }),
    ],
    []
  )
}
