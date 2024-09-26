import {
  CustomFieldContainerZone,
  CustomFieldFormTab,
  CustomFieldFormZone,
  CustomFieldModel,
  InjectionZone,
} from "@medusajs/admin-shared"
import * as React from "react"
import { INavItem } from "../../components/layout/nav-item"
import {
  DashboardExtensionConfig,
  MenuItemExtension,
  WidgetExtension,
} from "../../providers/medusa-app-provider/types"
import { CustomFieldRegistry } from "../custom-field-registry/custom-field-registry"

type MedusaAppProps = {
  config?: DashboardExtensionConfig
}

export type MenuItemPath = "coreExtensions" | "settingsExtensions"

export class MedusaApp {
  private widgets: Map<InjectionZone, React.ComponentType[]>
  private menus: Map<MenuItemPath, INavItem[]>
  private customFieldRegistry: CustomFieldRegistry

  constructor({ config = { widgets: [], menuItems: [] } }: MedusaAppProps) {
    this.widgets = this.populateWidgets(config.widgets)
    this.menus = this.populateMenus(config.menuItems)
    this.customFieldRegistry = new CustomFieldRegistry(config.customFields)
  }

  private populateWidgets(widgets: WidgetExtension[] | undefined) {
    const registry = new Map<InjectionZone, React.ComponentType[]>()

    if (!widgets) {
      return registry
    }

    widgets.forEach((widget) => {
      widget.zone.forEach((zone) => {
        if (!registry.has(zone)) {
          registry.set(zone, [])
        }
        registry.get(zone)!.push(widget.Component)
      })
    })

    return registry
  }

  private populateMenus(menuItems: MenuItemExtension[] | undefined) {
    const registry = new Map<MenuItemPath, INavItem[]>()
    const tempRegistry: Record<string, INavItem> = {}

    if (!menuItems) {
      return registry
    }

    menuItems.sort((a, b) => a.path.length - b.path.length)

    menuItems.forEach((item) => {
      if (item.path.includes("/:")) {
        if (process.env.NODE_ENV === "development") {
          console.warn(
            `Menu item for path "${item.path}" can't be added to the sidebar as it contains a parameter.`
          )
        }
        return
      }

      const isSettingsPath = item.path.startsWith("/settings")
      const key = isSettingsPath ? "settingsExtensions" : "coreExtensions"

      const navItem: INavItem = {
        label: item.label,
        to: item.path,
        icon: item.icon ? <item.icon /> : undefined,
        items: [],
      }

      const pathParts = item.path.split("/").filter(Boolean)
      const parentPath = "/" + pathParts.slice(0, -1).join("/")

      if (parentPath !== "/" && tempRegistry[parentPath]) {
        if (!tempRegistry[parentPath].items) {
          tempRegistry[parentPath].items = []
        }
        tempRegistry[parentPath].items!.push(navItem)
      } else {
        if (!registry.has(key)) {
          registry.set(key, [])
        }
        registry.get(key)!.push(navItem)
      }

      tempRegistry[item.path] = navItem
    })

    return registry
  }

  private getMenu(path: MenuItemPath) {
    return this.menus.get(path) || []
  }

  private getWidgets(zone: InjectionZone) {
    return this.widgets.get(zone) || []
  }

  private getFormFields(
    model: CustomFieldModel,
    zone: CustomFieldFormZone,
    tab?: CustomFieldFormTab
  ) {
    return this.customFieldRegistry.getFields(model, zone, tab)
  }

  private getFormConfigs(model: CustomFieldModel, zone: CustomFieldFormZone) {
    return this.customFieldRegistry.getConfigs(model, zone)
  }

  private getDisplays(model: CustomFieldModel, zone: CustomFieldContainerZone) {
    return this.customFieldRegistry.getDisplays(model, zone)
  }

  get api() {
    return {
      getMenu: this.getMenu.bind(this),
      getWidgets: this.getWidgets.bind(this),
      getFormFields: this.getFormFields.bind(this),
      getFormConfigs: this.getFormConfigs.bind(this),
      getDisplays: this.getDisplays.bind(this),
    }
  }
}
