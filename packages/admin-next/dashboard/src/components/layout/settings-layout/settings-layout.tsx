import { ArrowUturnLeft } from "@medusajs/icons"
import { IconButton, Text } from "@medusajs/ui"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link, useLocation } from "react-router-dom"

import { NavItem, NavItemProps } from "../nav-item"
import { Shell } from "../shell"

export const SettingsLayout = () => {
  return (
    <Shell>
      <SettingsSidebar />
    </Shell>
  )
}

const useSettingRoutes = (): NavItemProps[] => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      {
        label: t("profile.domain"),
        to: "/settings/profile",
      },
      {
        label: t("store.domain"),
        to: "/settings/store",
      },
      {
        label: t("users.domain"),
        to: "/settings/users",
      },
      {
        label: t("regions.domain"),
        to: "/settings/regions",
      },
      {
        label: "Taxes",
        to: "/settings/taxes",
      },
      {
        label: "Locations",
        to: "/settings/locations",
      },
      {
        label: t("salesChannels.domain"),
        to: "/settings/sales-channels",
      },
      {
        label: t("apiKeyManagement.domain"),
        to: "/settings/api-key-management",
      },
    ],
    [t]
  )
}

const SettingsSidebar = () => {
  const routes = useSettingRoutes()
  const { t } = useTranslation()

  const location = useLocation()
  const [from, setFrom] = useState("/orders")

  useEffect(() => {
    if (location.state?.from) {
      setFrom(location.state.from)
    }
  }, [location])

  return (
    <aside className="flex flex-1 flex-col justify-between overflow-y-auto">
      <div className="px-3 py-2">
        <div className="flex items-center gap-x-3 p-1">
          <Link to={from} replace className="flex items-center justify-center">
            <IconButton size="small" variant="transparent">
              <ArrowUturnLeft />
            </IconButton>
          </Link>
          <Text leading="compact" weight="plus" size="small">
            {t("general.settings")}
          </Text>
        </div>
      </div>
      <div className="px-3">
        <div className="border-ui-border-strong h-px w-full border-b border-dashed" />
      </div>
      <div className="flex flex-1 flex-col gap-y-4 overflow-y-auto py-2">
        <nav className="flex flex-col gap-y-1">
          {routes.map((setting) => (
            <NavItem key={setting.to} {...setting} />
          ))}
        </nav>
      </div>
    </aside>
  )
}
