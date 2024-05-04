import { useParams } from "react-router-dom"
import { RouteFocusModal } from "../../../components/route-modal"
import { AddCountriesForm } from "./components/add-countries-form"
import { useRegion } from "../../../hooks/api/regions"

export const RegionAddCountries = () => {
  const { id } = useParams()

  const {
    region,
    isPending: isLoading,
    isError,
    error,
  } = useRegion(id!, {
    fields: "*payment_providers",
  })

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal>
      {!isLoading && region && <AddCountriesForm region={region} />}
    </RouteFocusModal>
  )
}
