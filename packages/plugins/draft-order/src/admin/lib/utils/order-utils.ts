import { HttpTypes } from "@zjedene-medusa/types"

export function getUniqueShippingProfiles(
  items: HttpTypes.AdminOrderLineItem[]
): HttpTypes.AdminShippingProfile[] {
  const profiles = new Map<string, HttpTypes.AdminShippingProfile>()
  items.forEach((item) => {
    const profile = item.variant?.product?.shipping_profile
    if (profile) {
      profiles.set(profile.id, profile)
    }
  })
  return Array.from(profiles.values())
}

export function getItemsWithShippingProfile(
  shipping_profile_id: string,
  items: HttpTypes.AdminOrderLineItem[]
) {
  return items.filter(
    (item) =>
      item.variant?.product?.shipping_profile?.id === shipping_profile_id
  )
}

export function getOrderCustomer(obj: HttpTypes.AdminOrder) {
  const { first_name: sFirstName, last_name: sLastName } =
    obj.shipping_address || {}
  const { first_name: bFirstName, last_name: bLastName } =
    obj.billing_address || {}
  const { first_name: cFirstName, last_name: cLastName } = obj.customer || {}

  const customerName = [cFirstName, cLastName].filter(Boolean).join(" ")
  const shippingName = [sFirstName, sLastName].filter(Boolean).join(" ")
  const billingName = [bFirstName, bLastName].filter(Boolean).join(" ")

  const name = customerName || shippingName || billingName

  return name
}
