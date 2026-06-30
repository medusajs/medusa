import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { ArrowUturnLeft } from "@medusajs/icons"
import { clx, Divider, Text } from "@medusajs/ui"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link, useLocation } from "react-router-dom"

import { useExtension } from "../../../providers/extension-provider"
import { LayoutComposer } from "../../layout-composer"
import { CUSTOMIZE_IDS } from "../../layout-composer/constants"
import { INavItem, NavItem } from "../nav-item"
import { Shell } from "../shell"
import { UserMenu } from "../user-menu"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"
import { usePermissions } from "../../../providers/permissions-provider"

export const SettingsLayout = () => {
  return (
    <Shell>
      <SettingsSidebar />
    </Shell>
  )
}

const useSettingRoutes = (): INavItem[] => {
  const isTranslationsEnabled = useFeatureFlag("translation")
  const isRbacEnabled = useFeatureFlag("rbac")
  const { hasPermission } = usePermissions()
  const { t } = useTranslation()

  const canReadRoles = isRbacEnabled && hasPermission("rbac_role:read")
  const canReadPolicies = isRbacEnabled && hasPermission("rbac_policy:read")

  return useMemo(
    () => [
      {
        label: t("store.domain"),
        to: "/settings/store",
      },
      {
        label: t("users.domain"),
        to: "/settings/users",
      },
      ...(canReadRoles
        ? [
            {
              label: t("roles.domain"),
              to: "/settings/roles",
            },
          ]
        : []),
      ...(canReadPolicies
        ? [
            {
              label: t("policies.domain"),
              to: "/settings/policies",
            },
          ]
        : []),
      {
        label: t("regions.domain"),
        to: "/settings/regions",
      },
      {
        label: t("taxRegions.domain"),
        to: "/settings/tax-regions",
      },
      {
        label: t("returnReasons.domain"),
        to: "/settings/return-reasons",
      },
      {
        label: t("refundReasons.domain"),
        to: "/settings/refund-reasons",
      },
      {
        label: t("salesChannels.domain"),
        to: "/settings/sales-channels",
      },
      {
        label: t("productTypes.domain"),
        to: "/settings/product-types",
      },
      {
        label: t("productTags.domain"),
        to: "/settings/product-tags",
      },
      {
        label: t("stockLocations.domain"),
        to: "/settings/locations",
      },
      ...(isTranslationsEnabled
        ? [
            {
              label: t("translations.domain"),
              to: "/settings/translations",
            },
          ]
        : []),
    ],
    [t, isTranslationsEnabled, canReadRoles, canReadPolicies]
  )
}

const useDeveloperRoutes = (): INavItem[] => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      {
        label: t("apiKeyManagement.domain.publishable"),
        to: "/settings/publishable-api-keys",
      },
      {
        label: t("apiKeyManagement.domain.secret"),
        to: "/settings/secret-api-keys",
      },
      {
        label: t("workflowExecutions.domain"),
        to: "/settings/workflows",
      },
    ],
    [t]
  )
}

const useMyAccountRoutes = (): INavItem[] => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      {
        label: t("profile.domain"),
        to: "/settings/profile",
      },
    ],
    [t]
  )
}

/**
 * Ensure that the `from` prop is not another settings route, to avoid
 * the user getting stuck in a navigation loop.
 */
const getSafeFromValue = (from: string) => {
  if (from.startsWith("/settings")) {
    return "/orders"
  }

  return from
}

const toNavEntries = (items: INavItem[]) =>
  items.map((item) => (
    <LayoutComposer.Entry id={`settings-nav:${item.to}`} key={item.to}>
      <NavItem key={item.to} type="setting" {...item} />
    </LayoutComposer.Entry>
  ))

const SettingsSidebar = () => {
  const { getMenu } = useExtension()

  const routes = useSettingRoutes()
  const developerRoutes = useDeveloperRoutes()
  const myAccountRoutes = useMyAccountRoutes()
  const extensionRoutes = getMenu("settingsExtensions")

  return (
    <aside className="relative flex flex-1 flex-col justify-between overflow-y-auto">
      <div className="bg-ui-bg-subtle sticky top-0">
        <Header />
        <div className="flex items-center justify-center px-3">
          <Divider variant="dashed" />
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col overflow-y-auto">
          <LayoutComposer
            widgetsZonePrefix="settings.sidebar"
            preferredLayoutId={CORE_LAYOUT_IDS.SETTINGS_SIDEBAR}
            hasOutlet={false}
            disableWidgets
            customizeId={CUSTOMIZE_IDS.SETTINGS_SIDEBAR}
            controlSize="small"
            sections={{
              general: toNavEntries(routes),
              developer: toNavEntries(developerRoutes),
              myAccount: toNavEntries(myAccountRoutes),
              extensions: toNavEntries(extensionRoutes),
            }}
          />
        </div>
        <div className="bg-ui-bg-subtle sticky bottom-0">
          <UserSection />
        </div>
      </div>
    </aside>
  )
}

const Header = () => {
  const [from, setFrom] = useState("/orders")

  const { t } = useTranslation()
  const location = useLocation()

  useEffect(() => {
    if (location.state?.from) {
      setFrom(getSafeFromValue(location.state.from))
    }
  }, [location])

  return (
    <div className="bg-ui-bg-subtle p-3">
      <Link
        to={from}
        replace
        className={clx(
          "bg-ui-bg-subtle transition-fg flex items-center rounded-md outline-none",
          "hover:bg-ui-bg-subtle-hover",
          "focus-visible:shadow-borders-focus"
        )}
      >
        <div className="flex items-center gap-x-2.5 px-2 py-1">
          <div className="flex items-center justify-center">
            <ArrowUturnLeft className="text-ui-fg-subtle" />
          </div>
          <Text leading="compact" weight="plus" size="small">
            {t("app.nav.settings.header")}
          </Text>
        </div>
      </Link>
    </div>
  )
}

const UserSection = () => {
  return (
    <div>
      <div className="px-3">
        <Divider variant="dashed" />
      </div>
      <UserMenu />
    </div>
  )
}
