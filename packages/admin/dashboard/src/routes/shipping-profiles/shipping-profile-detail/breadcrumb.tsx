import { HttpTypes } from "@medusajs/types"
import { UIMatch } from "react-router-dom"
import { useShippingProfile } from "../../../hooks/api/shipping-profiles"

type ShippingProfileDetailBreadcrumbProps =
  UIMatch<HttpTypes.AdminShippingProfileResponse>

export const ShippingProfileDetailBreadcrumb = (
  props: ShippingProfileDetailBreadcrumbProps
) => {
  const { shipping_profile_id } = props.params || {}

  const { shipping_profile } = useShippingProfile(
    shipping_profile_id!,
    undefined,
    {
      initialData: props.loaderData,
      enabled: Boolean(shipping_profile_id),
    }
  )

  if (!shipping_profile) {
    return null
  }

  return <span>{shipping_profile.name}</span>
}

export const seo = (
  match: UIMatch<HttpTypes.AdminShippingProfileResponse>
) => ({
  title: match.loaderData?.shipping_profile?.name,
})
