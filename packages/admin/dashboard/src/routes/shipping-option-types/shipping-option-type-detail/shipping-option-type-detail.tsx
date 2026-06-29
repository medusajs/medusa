import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { useLoaderData, useParams } from "react-router-dom"

import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { LayoutComposer, detailPageDefaultEntries } from "../../../components/layout-composer"
import { useShippingOptionType } from "../../../hooks/api"
import { ShippingOptionTypeGeneralSection } from "./components/shipping-option-type-general-section"
import { shippingOptionTypeLoader } from "./loader"

export const ShippingOptionTypeDetail = () => {
  const { id } = useParams()
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof shippingOptionTypeLoader>
  >

  const { shipping_option_type, isPending, isError, error } =
    useShippingOptionType(id!, undefined, {
      initialData,
    })

  if (isPending || !shipping_option_type) {
    return <SingleColumnPageSkeleton sections={2} showJSON showMetadata />
  }

  if (isError) {
    throw error
  }

  return (
    <LayoutComposer
      widgetsZonePrefix="shipping_option_type.details"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      data={shipping_option_type}
      sections={{
        main: (
          <>
            <LayoutComposer.Entry id="ShippingOptionTypeGeneralSection">
              <ShippingOptionTypeGeneralSection
                shippingOptionType={shipping_option_type}
              />
            </LayoutComposer.Entry>
            {detailPageDefaultEntries(shipping_option_type, { permissions: false })}
          </>
        ),
      }}
    />
  )
}
