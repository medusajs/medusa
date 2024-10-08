import { useParams } from "react-router-dom"
import { RouteFocusModal } from "../../../components/modals"
import { useRegion } from "../../../hooks/api/regions"
import { AddCountriesForm } from "./components/add-countries-form"

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
