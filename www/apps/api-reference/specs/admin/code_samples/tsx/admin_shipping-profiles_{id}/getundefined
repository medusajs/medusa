import React from "react"
import { useAdminShippingProfile } from "medusa-react"

type Props = {
  shippingProfileId: string
}

const ShippingProfile = ({ shippingProfileId }: Props) => {
  const {
    shipping_profile,
    isLoading
  } = useAdminShippingProfile(
    shippingProfileId
  )

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {shipping_profile && (
        <span>{shipping_profile.name}</span>
      )}
    </div>
  )
}

export default ShippingProfile
