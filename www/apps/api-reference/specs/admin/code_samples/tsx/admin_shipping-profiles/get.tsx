import React from "react"
import { useAdminShippingProfiles } from "medusa-react"

const ShippingProfiles = () => {
  const {
    shipping_profiles,
    isLoading
  } = useAdminShippingProfiles()

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {shipping_profiles && !shipping_profiles.length && (
        <span>No Shipping Profiles</span>
      )}
      {shipping_profiles && shipping_profiles.length > 0 && (
        <ul>
          {shipping_profiles.map((profile) => (
            <li key={profile.id}>{profile.name}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ShippingProfiles
