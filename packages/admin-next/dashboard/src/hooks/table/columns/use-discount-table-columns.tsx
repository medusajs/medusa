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
      // columnHelper.accessor("sales_channels", {
      //   header: () => <SalesChannelHeader />,
      //   cell: ({ row }) => (
      //     <SalesChannelsCell salesChannels={row.original.sales_channels} />
      //   ),
      // }),
      // columnHelper.accessor("variants", {
      //   header: () => <VariantHeader />,
      //   cell: ({ row }) => <VariantCell variants={row.original.variants} />,
      // }),
      // columnHelper.accessor("status", {
      //   header: () => <ProductStatusHeader />,
      //   cell: ({ row }) => <ProductStatusCell status={row.original.status} />,
      // }),
    ],
    []
  ) as ColumnDef<Discount>[]
}
