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
import { UserMenu } from "../user-menu"

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
        label: t("productTags.domain"),
        to: "/settings/product-tags",
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

const useMyAccountRoutes = (): NavItemProps[] => {
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
  const myAccountRoutes = useMyAccountRoutes()

  const { t } = useTranslation()

  return (
    <aside className="flex flex-1 flex-col justify-between overflow-y-auto">
      <div className="flex flex-1 flex-col">
        <div className="bg-ui-bg-subtle sticky top-0 z-[1]">
          <Header />
          <div className="flex items-center justify-center px-3">
            <Divider variant="dashed" />
          </div>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto">
          <CollapsibleSection
            label={t("app.nav.settings.general")}
            items={routes}
          />
          <div className="flex items-center justify-center px-3">
            <Divider variant="dashed" />
          </div>
          <CollapsibleSection
            label={t("app.nav.settings.developer")}
            items={developerRoutes}
          />
          <div className="flex items-center justify-center px-3">
            <Divider variant="dashed" />
          </div>
          <CollapsibleSection
            label={t("app.nav.settings.myAccount")}
            items={myAccountRoutes}
          />
          {extensionRoutes.length > 0 && (
            <Fragment>
              <div className="flex items-center justify-center px-3">
                <Divider variant="dashed" />
              </div>
              <CollapsibleSection
                label={t("app.nav.common.extensions")}
                items={extensionRoutes}
              />
            </Fragment>
          )}
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

const CollapsibleSection = ({
  label,
  items,
}: {
  label: string
  items: NavItemProps[]
}) => {
  return (
    <Collapsible.Root defaultOpen className="py-3">
      <div className="px-3">
        <div className="text-ui-fg-muted flex h-7 items-center justify-between px-2">
          <Text size="small" leading="compact">
            {label}
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
            {items.map((setting) => (
              <NavItem key={setting.to} type="setting" {...setting} />
            ))}
          </nav>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
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
