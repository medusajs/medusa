import React from "react"
import { ShippingProfileType } from "@medusajs/medusa"
import { useAdminUpdateShippingProfile } from "medusa-react"

type Props = {
  shippingProfileId: string
}

const ShippingProfile = ({ shippingProfileId }: Props) => {
  const updateShippingProfile = useAdminUpdateShippingProfile(
    shippingProfileId
  )
  // ...

  const handleUpdate = (
    name: string,
    type: ShippingProfileType
  ) => {
    updateShippingProfile.mutate({
      name,
      type
    }, {
      onSuccess: ({ shipping_profile }) => {
        console.log(shipping_profile.name)
      }
    })
  }

  // ...
}

export default ShippingProfile
