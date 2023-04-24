import { Route, Routes } from "react-router-dom"
import SettingsCard from "../../components/atoms/settings-card"
import DollarSignIcon from "../../components/fundamentals/icons/dollar-sign-icon"
import MapPinIcon from "../../components/fundamentals/icons/map-pin-icon"
import TaxesIcon from "../../components/fundamentals/icons/taxes-icon"
import UsersIcon from "../../components/fundamentals/icons/users-icon"
import SettingsOverview from "../../components/templates/settings-overview"
import Currencies from "./currencies"
import Regions from "./regions"
import ReturnReasons from "./return-reasons"
import Taxes from "./taxes"
import GearIcon from "../../components/fundamentals/icons/gear-icon"
import SiteDetails from "./site/site-details"
import PayoutsFeesPage from "./payouts-fees"
import TruckIcon from "../../components/fundamentals/icons/truck-icon"
import StoreShippingProvidersIndex from "../store/settings/shipping-providers"
import { useUserPermissions } from "../../hooks/use-permissions"
import { useStorePermissions } from "../../hooks/use-store-permissions"
import { useAdminRegions } from "medusa-react"
import { MarketHausTaxSettings } from "./markethaus-tax"

const AdminSettingsIndex = () => {
  const { isAdmin } = useUserPermissions()
  const { canManageCurrencySettings, canManageTaxSettings } =
    useStorePermissions()
  const { regions } = useAdminRegions()

  const hasMarketHausTaxEnabled = regions?.some(
    (r) => r.tax_provider_id === "MarketHausTaxProvider"
  )

  if (!isAdmin) {
    return <>You do not have access to this page</>
  }

  return (
    <SettingsOverview
      title="Settings"
      subtitle="Manage the settings for all vendors"
    >
      <SettingsCard
        heading={"Site Details"}
        description={
          "Update site details such as name, description, logo, etc."
        }
        icon={<GearIcon />}
        to={`/admin/settings/site-details`}
        disabled={false}
      />
      <SettingsCard
        heading={"Regions"}
        description={"Manage the markets you will operate within"}
        icon={<MapPinIcon />}
        to={`/admin/settings/regions`}
        disabled={false}
      />
      {/* <SettingsCard
        heading={"Shipping"}
        description={"Manage shipping profiles"}
        icon={<TruckIcon />}
        to={`/admin/settings/shipping-profiles`}
      /> */}

      {canManageCurrencySettings && (
        <SettingsCard
          heading={"Currency Settings"}
          description={"Manage currency settings"}
          icon={<DollarSignIcon />}
          to={`/admin/settings/currencies`}
        />
      )}

      <SettingsCard
        heading={"Return Reasons"}
        description={"Manage Order settings"}
        icon={<DollarSignIcon />}
        to={`/admin/settings/return-reasons`}
      />
      <SettingsCard
        heading={"The Admin Team"}
        description={"Manage project admins"}
        icon={<UsersIcon />}
        to={`/admin/users`}
      />
      {canManageTaxSettings && (
        <SettingsCard
          heading={"Tax Settings"}
          description={"Manage taxes across regions and products"}
          icon={<TaxesIcon />}
          to={`/admin/settings/taxes`}
        />
      )}

      <SettingsCard
        heading={"MarketHaus Tax Settings"}
        description={"Setup your regions and taxes"}
        icon={<TaxesIcon />}
        to={`/admin/settings/markethaus-tax`}
      />

      <SettingsCard
        heading={"Payout & Fee Settings"}
        description={"Manage details about payouts and fees across vendors"}
        icon={<DollarSignIcon />}
        to={`/admin/settings/payouts-fees`}
      />
      <SettingsCard
        heading={"Third Party Shipping Providers"}
        description={"Integrate with third party shipping providers"}
        icon={<TruckIcon />}
        to={`/admin/settings/shipping-providers`}
        disabled={false}
      />
    </SettingsOverview>
  )
}

const AdminSettings = () => (
  <Routes>
    <Route path="/" element={<AdminSettingsIndex />} />
    <Route path="site-details" element={<SiteDetails />} />
    <Route path="currencies" element={<Currencies />} />
    <Route path="return-reasons" element={<ReturnReasons />} />
    <Route path="regions" element={<Regions />} />
    <Route path="regions/:id" element={<Regions />} />
    <Route path="taxes" element={<Taxes />} />
    <Route path="markethaus-tax" element={<MarketHausTaxSettings />} />
    <Route path="payouts-fees" element={<PayoutsFeesPage />} />
    <Route
      path="shipping-providers/*"
      element={<StoreShippingProvidersIndex />}
    />
  </Routes>
)

export default AdminSettings
