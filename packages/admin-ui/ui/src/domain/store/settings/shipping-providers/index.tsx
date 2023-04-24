import React, { FC } from "react"
import BreadCrumb from "../../../../components/molecules/breadcrumb"
import Spinner from "../../../../components/atoms/spinner"
import SettingsOverview from "../../../../components/templates/settings-overview"
import SettingsCard from "../../../../components/atoms/settings-card"
import { useGlobalSettingsBasePath } from "../../helpers"
import Details from "./details"
import { useGetStoreFulfillmentProviders } from "../../../../hooks/admin/fulfillment-providers/queries"
import { useAdminStore } from "medusa-react"
import { shippingProviderDetails } from "../../../../definitions/shipping-providers"
import { Route, Routes } from "react-router-dom"

export interface ShippingProvidersRouteProps {}

const StoreShippingProvidersRoute: FC<ShippingProvidersRouteProps> = () => {
  const basePath = useGlobalSettingsBasePath()
  const storeData = useAdminStore()
  const { fulfillmentProviders, isLoading } = useGetStoreFulfillmentProviders()

  if (!storeData?.store || !fulfillmentProviders || isLoading) {
    return <Spinner size="large" variant="secondary" />
  }

  const providers = fulfillmentProviders || []

  return (
    <>
      <BreadCrumb
        previousRoute={basePath}
        previousBreadcrumb="Global Settings"
        currentPage="Third Party Shipping Providers"
      />

      <SettingsOverview
        title="Third Party Shipping Providers"
        subtitle={
          <>
            Manage third party shipping integrations for{" "}
            <strong>{storeData.store?.name}</strong>
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

const StoreShippingProvidersIndex = () => (
  <Routes>
    <Route path="/" element={<StoreShippingProvidersRoute />} />
    <Route path="/:shippingProviderId" element={<Details />} />
  </Routes>
)

export default StoreShippingProvidersIndex
