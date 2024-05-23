import { ArrowUturnLeft, MinusMini } from "@medusajs/icons"
import { IconButton, Text } from "@medusajs/ui"
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
        label: t("salesChannels.domain"),
        to: "/settings/sales-channels",
      },
      {
        label: t("shippingProfile.domain"),
        to: "/settings/shipping-profiles",
      },
      {
        label: t("shipping.domain"),
        to: "/settings/shipping",
      },
    ],
    [t]
  )
}

const useDeveloperRoutes = (): NavItemProps[] => {
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

const SettingsSidebar = () => {
  const routes = useSettingRoutes()
  const developerRoutes = useDeveloperRoutes()
  const { t } = useTranslation()

  const location = useLocation()
  const [from, setFrom] = useState("/orders")

  useEffect(() => {
    if (location.state?.from) {
      setFrom(getSafeFromValue(location.state.from))
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
            {t("nav.settings")}
          </Text>
        </div>
      </div>
      <div className="px-3">
        <div className="border-ui-border-strong h-px w-full border-b border-dashed" />
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto">
        <Collapsible.Root defaultOpen className="py-3">
          <div className="px-3">
            <div className="text-ui-fg-muted flex h-7 items-center justify-between px-2">
              <Text size="small" leading="compact">
                {t("nav.general")}
              </Text>
              <Collapsible.Trigger asChild>
                <IconButton size="2xsmall" variant="transparent">
                  <MinusMini className="text-ui-fg-muted" />
                </IconButton>
              </Collapsible.Trigger>
            </div>
          </div>
          <Collapsible.Content>
            <div className="pt-0.5">
              <nav className="flex flex-col gap-y-1">
                {routes.map((setting) => (
                  <NavItem key={setting.to} {...setting} />
                ))}
              </nav>
            </div>
          </Collapsible.Content>
        </Collapsible.Root>
        <Collapsible.Root defaultOpen className="py-3">
          <div className="px-3">
            <div className="text-ui-fg-muted flex h-7 items-center justify-between px-2">
              <Text size="small" leading="compact">
                {t("nav.developer")}
              </Text>
              <Collapsible.Trigger asChild>
                <IconButton size="2xsmall" variant="transparent">
                  <MinusMini className="text-ui-fg-muted" />
                </IconButton>
              </Collapsible.Trigger>
            </div>
          </div>
          <Collapsible.Content>
            <div className="pt-0.5">
              <nav className="flex flex-col gap-y-1">
                {developerRoutes.map((setting) => (
                  <NavItem key={setting.to} {...setting} />
                ))}
              </nav>
            </div>
          </Collapsible.Content>
        </Collapsible.Root>
      </div>
    </aside>
  )
}
