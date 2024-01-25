import { ArrowUturnLeft, MinusMini, PlusMini } from "@medusajs/icons"
import { IconButton, Text, clx } from "@medusajs/ui"
import * as Collapsible from "@radix-ui/react-collapsible"
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
      <div className="p-3">
        <div className="flex items-center gap-x-2">
          <Link to={from} replace className="flex items-center justify-center">
            <IconButton size="base" variant="transparent">
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
        <Collapsible.Root defaultOpen>
          <div className="px-3">
            <Collapsible.Trigger asChild>
              <button
                className={clx(
                  "group/trigger flex items-center justify-between w-full px-2 py-1 transition-fg bg-ui-bg-subtle rounded-md text-ui-fg-muted",
                  "hover:bg-ui-bg-subtle-hover",
                  "active:bg-ui-bg-subtle-pressed",
                  "focus-visible:shadow-borders-focus"
                )}
              >
                <Text size="xsmall" leading="compact" weight="plus">
                  {t("general.general")}
                </Text>
                <div>
                  <MinusMini className="group-data-[state=closed]/trigger:hidden" />
                  <PlusMini className="group-data-[state=open]/trigger:hidden" />
                </div>
              </button>
            </Collapsible.Trigger>
          </div>
          <Collapsible.Content>
            <nav className="flex flex-col gap-y-1 pt-0.5">
              {routes.map((setting) => (
                <NavItem key={setting.to} {...setting} />
              ))}
            </nav>
          </Collapsible.Content>
        </Collapsible.Root>
      </div>
    </aside>
  )
}
