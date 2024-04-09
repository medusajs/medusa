import React from "react"

import { RouteFocusModal } from "../../../components/route-modal"
import { CreateShippingProfileForm } from "./components/create-shipping-profile-form"

export function ShippingProfileCreate() {
  return (
    <RouteFocusModal>
      <CreateShippingProfileForm />
    </RouteFocusModal>
  )
}
