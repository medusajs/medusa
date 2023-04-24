import React, { FC } from "react"
import { useGetVendor } from "../../../hooks/admin/vendors/queries"
import SettingsOverview from "../../../components/templates/settings-overview"
import SettingsCard from "../../../components/atoms/settings-card"
import MapPinIcon from "../../../components/fundamentals/icons/map-pin-icon"
import UsersIcon from "../../../components/fundamentals/icons/users-icon"
import DetailsIcon from "../../../components/fundamentals/details-icon"
import VendorDetails from "./vendor-details"
import Packages from "./packages"
import {
  SelectedVendorContext,
  useSelectedVendor,
} from "../../../context/vendor"
import Spinner from "../../../components/atoms/spinner"
import TruckIcon from "../../../components/fundamentals/icons/truck-icon"
import ShippingProviders from "./shipping-providers"
import Locations from "./locations"
import PackageIcon from "../../../components/fundamentals/icons/package-icon"
import Regions from "../../settings/regions"
import { useBasePath } from "../../../utils/routePathing"
import { Route, Routes, useParams } from "react-router-dom"

export interface VendorSettingsRouteProps {}

const VendorSettingsRoute: FC<VendorSettingsRouteProps> = () => {
  const { selectedVendor } = useSelectedVendor()
  const basePath = useBasePath()
  const baseSettingsPath = `${basePath}/settings`

  if (!selectedVendor) {
    return <Spinner size="large" variant="secondary" />
  }

  return (
    <>
      <SettingsOverview
        title="Vendor Settings"
        subtitle={
          <>
            Manage the settings for <strong>{selectedVendor.name}</strong>
          </>
        }
      >
        <SettingsCard
          heading={"Details"}
          description={
            "Manage the vendor details like name, description, logo, etc."
          }
          icon={<DetailsIcon />}
          to={`${baseSettingsPath}/vendor-details`}
          disabled={false}
        />
        <SettingsCard
          heading={"Team"}
          description={`Manage users with access to ${selectedVendor.name}`}
          icon={<UsersIcon />}
          to={`${basePath}/users`}
          disabled={false}
        />
        <SettingsCard
          heading={"Regions & Shipping"}
          description={"Manage the markets you will operate within"}
          icon={<MapPinIcon />}
          to={`${baseSettingsPath}/regions`}
          disabled={false}
        />
        <SettingsCard
          heading={"Third Party Shipping Providers"}
          description={"Integrate with third party shipping providers"}
          icon={<TruckIcon />}
          to={`${baseSettingsPath}/shipping-providers`}
          disabled={false}
        />
        <SettingsCard
          heading={"Packages"}
          description={"Manage package sizes"}
          icon={<PackageIcon />}
          to={`${baseSettingsPath}/packages`}
          disabled={false}
        />
        <SettingsCard
          heading={"Locations"}
          description={"Manage ship from location"}
          icon={<MapPinIcon />}
          to={`${baseSettingsPath}/locations`}
          disabled={false}
        />
      </SettingsOverview>
    </>
  )
}

const VendorSettingsIndex: FC<{}> = () => {
  const { vendor_id } = useParams<{ vendor_id: string }>()
  const { vendor } = useGetVendor(vendor_id)

  if (!vendor) return <Spinner size="large" variant="secondary" />

  return (
    <SelectedVendorContext.Provider value={vendor}>
      <Routes>
        <Route path="/" element={<VendorSettingsRoute />} />
        <Route path="vendor-details" element={<VendorDetails />} />
        <Route path="regions" element={<Regions />} />
        <Route path="regions/:id" element={<Regions />} />
        <Route path="packages" element={<Packages />} />
        <Route path="shipping-providers/*" element={<ShippingProviders />} />
        <Route path="locations/*" element={<Locations />} />
      </Routes>
    </SelectedVendorContext.Provider>
  )
}

export default VendorSettingsIndex
