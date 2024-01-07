import React from "react"
import { ShippingProfileType } from "@medusajs/medusa"
import { useAdminCreateShippingProfile } from "medusa-react"

const CreateShippingProfile = () => {
  const createShippingProfile = useAdminCreateShippingProfile()
  // ...

  const handleCreate = (
    name: string,
    type: ShippingProfileType
  ) => {
    createShippingProfile.mutate({
      name,
      type
    }, {
      onSuccess: ({ shipping_profile }) => {
        console.log(shipping_profile.id)
      }
    })
  }

  // ...
}

export default CreateShippingProfile
