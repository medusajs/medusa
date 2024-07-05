import { useMemo } from "react"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"

import type { Discount } from "@medusajs/medusa"

import {
  CodeCell,
  CodeHeader,
} from "../../../components/table/table-cells/discount/code-cell"
import {
  DescriptionHeader,
  DescriptionCell,
} from "../../../components/table/table-cells/discount/description-cell"
import {
  ValueCell,
  ValueHeader,
} from "../../../components/table/table-cells/discount/value-cell"
import {
  RedemptionCell,
  RedemptionHeader,
} from "../../../components/table/table-cells/discount/redemption-cell"
import {
  StatusHeader,
  StatusCell,
} from "../../../components/table/table-cells/discount/status-cell"

const columnHelper = createColumnHelper<Discount>()

export const useDiscountTableColumns = () => {
  return useMemo(
    () => [
      columnHelper.display({
        id: "discount",
        header: () => <CodeHeader />,
        cell: ({ row }) => <CodeCell discount={row.original} />,
      }),
      columnHelper.accessor("rule.description", {
        header: () => <DescriptionHeader />,
        cell: ({ row }) => <DescriptionCell discount={row.original} />,
      }),

      columnHelper.accessor("rule.value", {
        header: () => <ValueHeader />,
        cell: ({ row }) => (
          <ValueCell
            rule={row.original.rule}
            currencyCode={row.original.regions[0]?.currency_code}
          />
        ),
      }),
      columnHelper.display({
        id: "status",
        header: () => <StatusHeader />,
        cell: ({ row }) => <StatusCell discount={row.original} />,
      }),
      columnHelper.accessor("usage_count", {
        header: () => <RedemptionHeader />,
        cell: ({ row }) => (
          <RedemptionCell redemptions={row.original.usage_count} />
        ),
      }),
    ],
    []
  ) as ColumnDef<Discount>[]
}
