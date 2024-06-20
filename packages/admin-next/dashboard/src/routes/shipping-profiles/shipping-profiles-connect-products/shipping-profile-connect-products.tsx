import { useParams } from "react-router-dom"

import { RouteFocusModal } from "../../../components/route-modal"
import { ConnectProductsToShippingProfileForm } from "./components"
import { useShippingProfile } from "../../../hooks/api/shipping-profiles"

export const ShippingProfileConnectProducts = () => {
  const { id } = useParams()
  const {
    shipping_profile,
    isPending: isLoading,
    isError,
    error,
  } = useShippingProfile(id!)

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal>
      {!isLoading && shipping_profile && (
        <ConnectProductsToShippingProfileForm
          shippingProfile={shipping_profile}
        />
      )}
    </RouteFocusModal>
  )
}
