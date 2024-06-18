import { useParams } from "react-router-dom"

import { RouteDrawer } from "../../../components/route-modal"
import { useTaxRegion } from "../../../hooks/api/tax-regions"

export const TaxRegionEdit = () => {
  const { id } = useParams()

  const { tax_region, isPending, isError, error } = useTaxRegion(id!)

  return (
    <RouteDrawer>
      <RouteDrawer.Header></RouteDrawer.Header>
    </RouteDrawer>
  )
}
