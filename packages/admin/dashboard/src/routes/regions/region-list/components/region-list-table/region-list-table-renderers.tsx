import type { HttpTypes } from "@medusajs/types"
import { CountriesCell } from "../../../../../components/table/table-cells/region/countries-cell"
import { PaymentProvidersCell } from "../../../../../components/table/table-cells/region/payment-providers-cell"
import { registerCellRenderer } from "../../../../../lib/table/cell-renderers"

registerCellRenderer("region_countries", {
  render: (_value, row) => (
    <CountriesCell countries={(row as HttpTypes.AdminRegion).countries} />
  ),
})

registerCellRenderer("region_payment_providers", {
  render: (_value, row) => (
    <PaymentProvidersCell
      paymentProviders={(row as HttpTypes.AdminRegion).payment_providers}
    />
  ),
})
