import { ShippingOption } from "@medusajs/medusa"
import { PricedShippingOption } from "@medusajs/medusa/dist/types/pricing"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"

import {
  AdminOnlyCell,
  AdminOnlyHeader,
} from "../../../components/table/table-cells/shipping-option/admin-only-cell"
import {
  IsReturnCell,
  IsReturnHeader,
} from "../../../components/table/table-cells/shipping-option/is-return-cell"
import {
  PriceTypeCell,
  PriceTypeHeader,
} from "../../../components/table/table-cells/shipping-option/price-type-cell"
import {
  ShippingOptionCell,
  ShippingOptionHeader,
} from "../../../components/table/table-cells/shipping-option/shipping-option-cell"
import {
  ShippingPriceCell,
  ShippingPriceHeader,
} from "../../../components/table/table-cells/shipping-option/shipping-price-cell/shipping-price-cell"
import {
  SubtotalRequirementCell,
  SubtotalRequirementHeader,
} from "../../../components/table/table-cells/shipping-option/subtotal-requirement-cell"

const columnHelper = createColumnHelper<PricedShippingOption>()

export const useShippingOptionTableColumns = () => {
  return useMemo(
    () => [
      columnHelper.accessor("name", {
        header: () => <ShippingOptionHeader />,
        cell: ({ getValue }) => <ShippingOptionCell name={getValue()} />,
      }),
      columnHelper.accessor("is_return", {
        header: () => <IsReturnHeader />,
        cell: (cell) => {
          const value = cell.getValue()

          return <IsReturnCell isReturn={value} />
        },
      }),
      columnHelper.accessor("price_type", {
        header: () => <PriceTypeHeader />,
        cell: ({ getValue }) => {
          const type = getValue()

          return <PriceTypeCell priceType={type} />
        },
      }),
      columnHelper.accessor("price_incl_tax", {
        header: () => <ShippingPriceHeader />,
        cell: ({ getValue, row }) => {
          const isCalculated = row.original.price_type === "calculated"
          const amount = getValue()
          const currencyCode = row.original.region!.currency_code

          return (
            <ShippingPriceCell
              isCalculated={isCalculated}
              currencyCode={currencyCode}
              price={amount}
            />
          )
        },
      }),
      columnHelper.display({
        id: "min_amount",
        header: () => <SubtotalRequirementHeader type="min" />,
        cell: ({ row }) => {
          return (
            <SubtotalRequirementCell
              type="min"
              shippingOption={row.original as unknown as ShippingOption}
            />
          )
        },
      }),
      columnHelper.display({
        id: "max_amount",
        header: () => <SubtotalRequirementHeader type="max" />,
        cell: ({ row }) => {
          return (
            <SubtotalRequirementCell
              type="max"
              shippingOption={row.original as unknown as ShippingOption}
            />
          )
        },
      }),
      columnHelper.accessor("admin_only", {
        header: () => <AdminOnlyHeader />,
        cell: (cell) => {
          const value = cell.getValue() || false

          return <AdminOnlyCell adminOnly={value} />
        },
      }),
    ],
    []
  )
}
