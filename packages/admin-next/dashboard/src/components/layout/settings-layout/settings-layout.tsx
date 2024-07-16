import { ArrowUturnLeft, MinusMini } from "@medusajs/icons"
import { IconButton, Text, clx } from "@medusajs/ui"
import * as Collapsible from "@radix-ui/react-collapsible"
import { Fragment, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link, useLocation } from "react-router-dom"

import { settingsRouteRegex } from "../../../lib/extension-helpers"
import { Divider } from "../../common/divider"
import { NavItem, NavItemProps } from "../nav-item"
import { Shell } from "../shell"

import routes from "virtual:medusa/routes/links"

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
        label: t("taxRegions.domain"),
        to: "/settings/tax-regions",
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
        label: t("stockLocations.domain"),
        to: "/settings/locations",
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

const useExtensionRoutes = (): NavItemProps[] => {
  const links = routes.links

  return useMemo(() => {
    const settingsLinks = links.filter((link) =>
      settingsRouteRegex.test(link.path)
    )

    return settingsLinks.map((link) => ({
      label: link.label,
      to: link.path,
    }))
  }, [links])
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
  const extensionRoutes = useExtensionRoutes()

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
      <div className="p-3">
        <Link
          to={from}
          replace
          className={clx(
            "bg-ui-bg-subtle transition-fg flex items-center rounded-md outline-none",
            "hover:bg-ui-bg-subtle-hover"
          )}
        >
          <div className="flex items-center gap-x-2 py-1 pl-0.5 pr-2">
            <div className="flex size-6 items-center justify-center">
              <ArrowUturnLeft className="text-ui-fg-subtle" />
            </div>
            <Text leading="compact" weight="plus" size="small">
              {t("nav.settings")}
            </Text>
          </div>
        </Link>
      </div>
      <div className="flex items-center justify-center px-3">
        <Divider variant="dashed" />
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
              <nav className="flex flex-col gap-y-0.5">
                {routes.map((setting) => (
                  <NavItem key={setting.to} type="setting" {...setting} />
                ))}
              </nav>
            </div>
          </Collapsible.Content>
        </Collapsible.Root>
        <div className="flex items-center justify-center px-3">
          <Divider variant="dashed" />
        </div>
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
              <nav className="flex flex-col gap-y-0.5">
                {developerRoutes.map((setting) => (
                  <NavItem key={setting.to} type="setting" {...setting} />
                ))}
              </nav>
            </div>
          </Collapsible.Content>
        </Collapsible.Root>
        {extensionRoutes.length > 0 && (
          <Fragment>
            <div className="flex items-center justify-center px-3">
              <Divider variant="dashed" />
            </div>
            <Collapsible.Root defaultOpen className="py-3">
              <div className="px-3">
                <div className="text-ui-fg-muted flex h-7 items-center justify-between px-2">
                  <Text size="small" leading="compact">
                    {t("nav.extensions")}
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
                  <nav className="flex flex-col gap-y-0.5">
                    {extensionRoutes.map((setting) => (
                      <NavItem key={setting.to} {...setting} />
                    ))}
                  </nav>
                </div>
              </Collapsible.Content>
            </Collapsible.Root>
          </Fragment>
        )}
      </div>
    </aside>
  )
}
