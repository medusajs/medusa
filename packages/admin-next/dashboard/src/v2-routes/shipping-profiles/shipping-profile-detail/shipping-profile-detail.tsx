import { useParams } from "react-router-dom"
import { JsonViewSection } from "../../../components/common/json-view-section"
import { useShippingProfile } from "../../../hooks/api/shipping-profiles"
import { ShippingProfileGeneralSection } from "./components/shipping-profile-general-section"

export const ShippingProfileDetail = () => {
  const { id } = useParams()

  const { shipping_profile, isLoading, isError, error } = useShippingProfile(
    id!
  )

  if (isLoading || !shipping_profile) {
    return <div>Loading...</div>
  }

  if (isError) {
    throw error
  }

  return (
    <div className="flex flex-col gap-y-2">
      <ShippingProfileGeneralSection profile={shipping_profile} />
      <JsonViewSection data={shipping_profile} />
    </div>
  )
}
