import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { useLoaderData, useParams } from "react-router-dom"

import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { LayoutComposer, detailPageDefaultEntries } from "../../../components/layout-composer"
import { useShippingProfile } from "../../../hooks/api/shipping-profiles"
import { ShippingProfileGeneralSection } from "./components/shipping-profile-general-section"

import { shippingProfileLoader } from "./loader"

export const ShippingProfileDetail = () => {
  const { shipping_profile_id } = useParams()

  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof shippingProfileLoader>
  >

  const { shipping_profile, isLoading, isError, error } = useShippingProfile(
    shipping_profile_id!,
    undefined,
    { initialData }
  )

  if (isLoading || !shipping_profile) {
    return <SingleColumnPageSkeleton sections={1} showJSON showMetadata />
  }

  if (isError) {
    throw error
  }

  return (
    <LayoutComposer
      widgetsZonePrefix="shipping_profile.details"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      data={shipping_profile}
      sections={{
        main: (
          <>
            <LayoutComposer.Entry id="ShippingProfileGeneralSection">
              <ShippingProfileGeneralSection profile={shipping_profile} />
            </LayoutComposer.Entry>
            {detailPageDefaultEntries(shipping_profile, { permissions: false })}
          </>
        ),
      }}
    />
  )
}
