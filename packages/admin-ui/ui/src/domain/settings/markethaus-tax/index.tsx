import { FC } from "react"
import {
  useAdminGetConfiguredTaxRegions,
  useAdminGetTaxRegions,
} from "../../../hooks/admin/tax-regions/queries"
import Table from "../../../components/molecules/table"
import ConfiguredTaxRegionsTable from "./configured-tax-regions-table"

export const MarketHausTaxSettings: FC<{}> = () => {
  const { tax_regions } = useAdminGetTaxRegions()
  const { configured_tax_regions } = useAdminGetConfiguredTaxRegions()

  return <ConfiguredTaxRegionsTable />
}
