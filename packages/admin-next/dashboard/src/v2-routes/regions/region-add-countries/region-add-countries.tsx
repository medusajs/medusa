import { useParams } from "react-router-dom"
import { RouteFocusModal } from "../../../components/route-modal"
import { AddCountriesForm } from "./components/add-countries-form"
import { useV2Region } from "../../../lib/api-v2/region"

export const RegionAddCountries = () => {
  const { id } = useParams()

  const { region, isLoading, isError, error } = useV2Region(id!)

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal>
      {!isLoading && region && <AddCountriesForm region={region} />}
    </RouteFocusModal>
  )
}
