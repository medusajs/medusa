import React, { FC } from "react"
import { useParams } from "react-router-dom"
import Spinner from "../../../../components/atoms/spinner"
import BreadCrumb from "../../../../components/molecules/breadcrumb"
import { useSelectedVendor } from "../../../../context/vendor"
import { shippingProviderDetails } from "../../../../definitions/shipping-providers"
import { useVendorSettingsBasePath } from "../../helpers"
import { shippingProviderForms } from "./helpers"

export interface VendorShippingProviderDetailsRouteProps {}

const VendorShippingProviderDetailsRoute: FC<
  VendorShippingProviderDetailsRouteProps
> = () => {
  const { shippingProviderId } = useParams<{ shippingProviderId: string }>()
  const { selectedVendor } = useSelectedVendor()
  const shippingProvider = shippingProviderDetails[shippingProviderId!]
  const basePath = useVendorSettingsBasePath(
    selectedVendor?.id,
    "/shipping-providers"
  )
  const Form = shippingProviderForms[shippingProviderId!]

  if (!shippingProvider) return <Spinner variant="secondary" size="large" />

  return (
    <>
      <BreadCrumb
        previousRoute={basePath}
        previousBreadcrumb="Shipping Providers"
        currentPage={shippingProvider.name}
      />

      {Form && (
        <Form vendor={selectedVendor} shippingProvider={shippingProvider} />
      )}

      {!Form && (
        <h2 className="text-lg mt-6 font-medium">
          This shipping provider is not yet supported.
        </h2>
      )}
    </>
  )
}

export default VendorShippingProviderDetailsRoute
