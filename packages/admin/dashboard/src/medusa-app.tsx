import { InjectionZone } from "@medusajs/admin-shared"
import {
  Buildings,
  CurrencyDollar,
  ReceiptPercent,
  ShoppingCart,
  Tag,
  Users,
} from "@medusajs/icons"
import { ComponentType } from "react"
import { NavItemProps } from "./components/layout/nav-item"
import { i18n } from "./components/utilities/i18n"
import {
  DashboardExtensionConfig,
  MenuItemExtension,
  RoutingExtensionConfig,
  WidgetExtension,
} from "./providers/extensions-provider/types"

type MedusaAppProps = {
  config?: DashboardExtensionConfig
}

export class MedusaApp {
  private widgets: WidgetRegistry
  private router: Router

  constructor({
    config = { widgets: [], routing: { menuItems: [], routes: [] } },
  }: MedusaAppProps) {
    this.widgets = new WidgetRegistry(config.widgets)
    this.router = new Router(config.routing)

    this.getWidgets = this.getWidgets.bind(this)
    this.getMenuItems = this.getMenuItems.bind(this)
  }

  getWidgets(zone: InjectionZone): ComponentType[] {
    return this.widgets.getWidgets(zone)
  }

  getMenuItems(path: MenuItemPath): NavItemProps[] {
    return this.router.getMenuItems(path)
  }

  // render() {
  //   return (
  //     <App
  //       api={{
  //         getWidgets: this.getWidgets,
  //         getMenuItems: this.getMenuItems,
  //       }}
  //     />
  //   )
  // }
}

class WidgetRegistry {
  private _registry: Map<InjectionZone, ComponentType[]>

  constructor(widgets: WidgetExtension[]) {
    const registry = new Map<InjectionZone, ComponentType[]>()
    widgets.forEach((widget) => {
      widget.zone.forEach((zone) => {
        if (!registry.has(zone)) {
          registry.set(zone, [])
        }
        registry.get(zone)!.push(widget.Component)
      })
    })
    this._registry = registry
  }

  public getWidgets(zone: InjectionZone): ComponentType[] {
    return this._registry.get(zone) || []
  }
}

// Menu items

const coreMenuItems: NavItemProps[] = [
  {
    icon: <ShoppingCart />,
    label: i18n.t("orders.domain"),
    to: "/orders",
  },
  {
    icon: <Tag />,
    label: i18n.t("products.domain"),
    to: "/products",
    items: [
      {
        label: i18n.t("collections.domain"),
        to: "/collections",
      },
      {
        label: i18n.t("categories.domain"),
        to: "/categories",
      },
    ],
  },
  {
    icon: <Buildings />,
    label: i18n.t("inventory.domain"),
    to: "/inventory",
    items: [
      {
        label: i18n.t("reservations.domain"),
        to: "/reservations",
      },
    ],
  },
  {
    icon: <Users />,
    label: i18n.t("customers.domain"),
    to: "/customers",
    items: [
      {
        label: i18n.t("customerGroups.domain"),
        to: "/customer-groups",
      },
    ],
  },
  {
    icon: <ReceiptPercent />,
    label: i18n.t("promotions.domain"),
    to: "/promotions",
    items: [
      {
        label: i18n.t("campaigns.domain"),
        to: "/campaigns",
      },
    ],
  },
  {
    icon: <CurrencyDollar />,
    label: i18n.t("priceLists.domain"),
    to: "/price-lists",
  },
]

const settingsMenuItems: NavItemProps[] = [
  {
    label: i18n.t("store.domain"),
    to: "/settings/store",
  },
  {
    label: i18n.t("users.domain"),
    to: "/settings/users",
  },
  {
    label: i18n.t("regions.domain"),
    to: "/settings/regions",
  },
  {
    label: i18n.t("taxRegions.domain"),
    to: "/settings/tax-regions",
  },
  {
    label: i18n.t("returnReasons.domain"),
    to: "/settings/return-reasons",
  },
  {
    label: i18n.t("salesChannels.domain"),
    to: "/settings/sales-channels",
  },
  {
    label: i18n.t("productTypes.domain"),
    to: "/settings/product-types",
  },
  {
    label: i18n.t("productTags.domain"),
    to: "/settings/product-tags",
  },
  {
    label: i18n.t("stockLocations.domain"),
    to: "/settings/locations",
  },
]

const developerMenuItems: NavItemProps[] = [
  {
    label: i18n.t("apiKeyManagement.domain.publishable"),
    to: "/settings/publishable-api-keys",
  },
  {
    label: i18n.t("apiKeyManagement.domain.secret"),
    to: "/settings/secret-api-keys",
  },
  {
    label: i18n.t("workflowExecutions.domain"),
    to: "/settings/workflows",
  },
]

const myAccountMenuItems: NavItemProps[] = [
  {
    label: i18n.t("profile.domain"),
    to: "/settings/profile",
  },
]

export type MenuItemPath =
  | "core"
  | "settings"
  | "developer"
  | "myAccount"
  | "coreExtensions"
  | "settingsExtensions"

class Router {
  private _coreMenuItems: NavItemProps[]
  private _settingsMenuItems: NavItemProps[]
  private _developerMenuItems: NavItemProps[]
  private _myAccountMenuItems: NavItemProps[]

  private _coreMenuItemExtensions: NavItemProps[]
  private _settingsMenuItemExtensions: NavItemProps[]

  constructor(config: RoutingExtensionConfig) {
    const { coreMenuItemExtensions, settingsMenuItemExtensions } =
      this.splitMenuItemsBySettingsPath(config.menuItems)

    this._coreMenuItems = coreMenuItems
    this._settingsMenuItems = settingsMenuItems
    this._developerMenuItems = developerMenuItems
    this._myAccountMenuItems = myAccountMenuItems
    this._coreMenuItemExtensions = coreMenuItemExtensions
    this._settingsMenuItemExtensions = settingsMenuItemExtensions
  }

  getMenuItems(path: MenuItemPath): NavItemProps[] {
    switch (path) {
      case "core":
        return this._coreMenuItems
      case "settings":
        return this._settingsMenuItems
      case "developer":
        return this._developerMenuItems
      case "myAccount":
        return this._myAccountMenuItems
      case "coreExtensions":
        return this._coreMenuItemExtensions
      case "settingsExtensions":
        return this._settingsMenuItemExtensions
      default:
        return []
    }
  }

  private splitMenuItemsBySettingsPath(menuItems: MenuItemExtension[]) {
    const coreMenuItemExtensions: NavItemProps[] = []
    const settingsMenuItemExtensions: NavItemProps[] = []

    menuItems.forEach((item) => {
      if (item.path.startsWith("/settings")) {
        settingsMenuItemExtensions.push({
          label: item.label,
          to: item.path,
          icon: item.icon ? <item.icon /> : undefined,
        })
      } else {
        coreMenuItemExtensions.push({
          label: item.label,
          to: item.path,
          icon: item.icon ? <item.icon /> : undefined,
        })
      }
    })

    return { coreMenuItemExtensions, settingsMenuItemExtensions }
  }
}
