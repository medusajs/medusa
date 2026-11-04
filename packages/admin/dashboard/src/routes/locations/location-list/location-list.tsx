import { ShoppingBag, TruckFast } from "@medusajs/icons"
import { Container, Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { SidebarLink } from "../../../components/common/sidebar-link/sidebar-link"
import { LayoutComposer } from "../../../components/layout-composer"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"
import { ConfigurableLocationListTable } from "./configurable-location-list-table"
import { LocationListTable } from "./location-list-table"
import { PermissionGuard } from "../../../components/common/permission-guard"

export function LocationList() {
  const isViewConfigEnabled = useFeatureFlag("view_configurations")

  return (
    <LayoutComposer
      widgetsZonePrefix="location.list"
      preferredLayoutId={CORE_LAYOUT_IDS.TWO_COLUMN}
      sections={{
        main: (
          <>
            <LayoutComposer.Entry id="stock-locations-table">
              {isViewConfigEnabled ? (
                <ConfigurableLocationListTable />
              ) : (
                <LocationListTable />
              )}
            </LayoutComposer.Entry>
          </>
        ),
        side: (
          <>
            <LayoutComposer.Entry id="LinksSection">
              <PermissionGuard
                permissions={[
                  "shipping_option_type:read",
                  "shipping_profile:read",
                ]}
              >
                <LinksSection />
              </PermissionGuard>
            </LayoutComposer.Entry>
          </>
        ),
      }}
    />
  )
}

const LinksSection = () => {
  const { t } = useTranslation()

  return (
    <Container className="p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("stockLocations.sidebar.header")}</Heading>
      </div>

      <PermissionGuard permission={"shipping_profile:read"}>
        <SidebarLink
          to="/settings/locations/shipping-profiles"
          labelKey={t("stockLocations.sidebar.shippingProfiles.label")}
          descriptionKey={t(
            "stockLocations.sidebar.shippingProfiles.description"
          )}
          icon={<ShoppingBag />}
        />
      </PermissionGuard>
      <PermissionGuard permission={"shipping_option_type:read"}>
        <SidebarLink
          to="/settings/locations/shipping-option-types"
          labelKey={t("stockLocations.sidebar.shippingOptionTypes.label")}
          descriptionKey={t(
            "stockLocations.sidebar.shippingOptionTypes.description"
          )}
          icon={<TruckFast />}
        />
      </PermissionGuard>
    </Container>
  )
}
