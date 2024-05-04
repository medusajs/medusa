import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { RegionDTO } from "@medusajs/types"

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

const columnHelper = createColumnHelper<RegionDTO>()

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
