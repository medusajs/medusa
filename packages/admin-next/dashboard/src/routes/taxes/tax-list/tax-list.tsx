import { TaxListCallout } from "./components/tax-list-callout"
import { TaxListTable } from "./components/tax-list-table"

export const TaxList = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <TaxListCallout />
      <TaxListTable />
    </div>
  )
}
