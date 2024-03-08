import { useAdminRegion } from "medusa-react"
import { useParams } from "react-router-dom"
import { RouteFocusModal } from "../../../components/route-modal"
import { AddCountriesForm } from "./components/add-countries-form"

export const RegionAddCountries = () => {
  const { id } = useParams()

  const { region, isLoading, isError, error } = useAdminRegion(id!)

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal>
      {!isLoading && region && <AddCountriesForm region={region} />}
    </RouteFocusModal>
  )
}
