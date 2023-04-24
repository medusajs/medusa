import React, { FC } from "react"
import { useParams } from "react-router-dom"
import Spinner from "../../../../components/atoms/spinner"
import BreadCrumb from "../../../../components/molecules/breadcrumb"
import { shippingProviderDetails } from "../../../../definitions/shipping-providers"
import { useGlobalSettingsBasePath } from "../../helpers"
import { shippingProviderForms } from "./helpers"

export interface StoreShippingProviderDetailsRouteProps {}

const StoreShippingProviderDetailsRoute: FC<
  StoreShippingProviderDetailsRouteProps
> = () => {
  const { shippingProviderId } = useParams<{ shippingProviderId: string }>()
  const shippingProvider = shippingProviderDetails[shippingProviderId!]

  const basePath = useGlobalSettingsBasePath("/shipping-providers")
  const Form = shippingProviderForms[shippingProviderId!]

  if (!shippingProvider) {
    return <Spinner variant="secondary" size="large" />
  }

  return (
    <>
      <BreadCrumb
        previousRoute={basePath}
        previousBreadcrumb="Shipping Providers"
        currentPage={shippingProvider.name}
      />
      {Form && <Form shippingProvider={shippingProvider} />}
      {!Form && (
        <h2 className="text-lg mt-6 font-medium">
          This shipping provider is not yet supported.
        </h2>
      )}
    </>
  )
}

export default StoreShippingProviderDetailsRoute
