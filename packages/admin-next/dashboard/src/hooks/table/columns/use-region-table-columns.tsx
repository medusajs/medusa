import { Region } from "@medusajs/medusa"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"

import {
  CountriesCell,
  CountriesHeader,
} from "../../../components/table/table-cells/region/countries-cell"
import {
  FulfillmentProvidersCell,
  FulfillmentProvidersHeader,
} from "../../../components/table/table-cells/region/fulfillment-providers-cell"
import {
  PaymentProvidersCell,
  PaymentProvidersHeader,
} from "../../../components/table/table-cells/region/payment-providers-cell"
import {
  RegionCell,
  RegionHeader,
} from "../../../components/table/table-cells/region/region-cell"

const columnHelper = createColumnHelper<Region>()

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
      columnHelper.accessor("fulfillment_providers", {
        header: () => <FulfillmentProvidersHeader />,
        cell: ({ getValue }) => (
          <FulfillmentProvidersCell fulfillmentProviders={getValue()} />
        ),
      }),
    ],
    []
  )
}
