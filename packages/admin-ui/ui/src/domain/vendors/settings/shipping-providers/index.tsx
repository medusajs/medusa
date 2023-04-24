import React, { FC } from "react"
import BreadCrumb from "../../../../components/molecules/breadcrumb"
import { useSelectedVendor } from "../../../../context/vendor"
import Spinner from "../../../../components/atoms/spinner"
import SettingsOverview from "../../../../components/templates/settings-overview"
import SettingsCard from "../../../../components/atoms/settings-card"
import { useVendorSettingsBasePath } from "../../helpers"
import Details from "./details"
import { useGetVendorFulfillmentProviders } from "../../../../hooks/admin/fulfillment-providers/queries"
import { shippingProviderDetails } from "../../../../definitions/shipping-providers"
import { Route, Routes } from "react-router-dom"

export interface ShippingProvidersRouteProps {}

const ShippingProvidersRoute: FC<ShippingProvidersRouteProps> = () => {
  const { selectedVendor } = useSelectedVendor()
  const basePath = useVendorSettingsBasePath(selectedVendor?.id)
  const { fulfillmentProviders, isLoading } = useGetVendorFulfillmentProviders(
    selectedVendor!.id
  )

  if (!selectedVendor || !fulfillmentProviders || isLoading) {
    return <Spinner size="large" variant="secondary" />
  }

  const providers = fulfillmentProviders || []

  return (
    <>
      <BreadCrumb
        previousRoute={basePath}
        previousBreadcrumb="Vendor Settings"
        currentPage="Third Party Shipping Providers"
      />

      <SettingsOverview
        title="Third Party Shipping Providers"
        subtitle={
          <>
            Manage third party shipping integrations for{" "}
            <strong>{selectedVendor.name}</strong>
          </>
        }
      >
        {providers
          .filter((p) => !!shippingProviderDetails[p.id])
          .map((provider) => {
            const { id, configured } = provider
            const { logo, name } = shippingProviderDetails[provider.id]
            return (
              <SettingsCard
                key={provider.id}
                heading={!logo ? name : ""}
                description={""}
                logo={logo || null}
                to={`${basePath}/shipping-providers/${id}`}
                disabled={false}
                active={configured}
              />
            )
          })}
      </SettingsOverview>
    </>
  )
}

const ShippingProvidersIndex: FC<{}> = () => (
  <Routes>
    <Route path="/" element={<ShippingProvidersRoute />} />
    <Route path="/:shippingProviderId" element={<Details />} />
  </Routes>
)

export default ShippingProvidersIndex
