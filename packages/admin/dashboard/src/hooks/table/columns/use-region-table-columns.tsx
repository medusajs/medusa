import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"

import {
  CountriesCell,
  CountriesHeader,
} from "../../../components/table/table-cells/region/countries-cell"
import {
  PaymentProvidersCell,
  PaymentProvidersHeader,
} from "../../../components/table/table-cells/region/payment-providers-cell"
import {
  RegionCell,
  RegionHeader,
} from "../../../components/table/table-cells/region/region-cell"
import { HttpTypes } from "@medusajs/types"

const columnHelper = createColumnHelper<HttpTypes.AdminRegion>()

export const useRegionTableColumns = () => {
  return useMemo(
    () => [
      columnHelper.accessor("name", {
        header: () => <RegionHeader />,
        cell: ({ getValue }) => <RegionCell name={getValue()} />,
      }),
      columnHelper.accessor("countries", {
        header: () => <CountriesHeader />,
        cell: ({ getValue }) => <CountriesCell countries={getValue()} />,
      }),
      columnHelper.accessor("payment_providers", {
        header: () => <PaymentProvidersHeader />,
        cell: ({ getValue }) => (
          <PaymentProvidersCell paymentProviders={getValue()} />
        ),
      }),
    ],
    []
  )
}
