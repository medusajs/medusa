import React from "react"
import { useAdminDeleteShippingProfile } from "medusa-react"

type Props = {
  shippingProfileId: string
}

const ShippingProfile = ({ shippingProfileId }: Props) => {
  const deleteShippingProfile = useAdminDeleteShippingProfile(
    shippingProfileId
  )
  // ...

  const handleDelete = () => {
    deleteShippingProfile.mutate(void 0, {
      onSuccess: ({ id, object, deleted }) => {
        console.log(id)
      }
    })
  }

  // ...
}

export default ShippingProfile
