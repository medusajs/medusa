import { InjectionZone } from "@medusajs/admin-shared"
import * as React from "react"
import App from "./app"
import { NavItemProps } from "./components/layout/nav-item"
import "./index.css"
import {
  DashboardExtensionConfig,
  MenuItemExtension,
  WidgetExtension,
} from "./providers/medusa-app-provider/types"

type MedusaAppProps = {
  config?: DashboardExtensionConfig
}

export type MenuItemPath = "coreExtensions" | "settingsExtensions"

export class MedusaApp {
  widgets: Map<InjectionZone, React.ComponentType[]>
  menus: Map<MenuItemPath, NavItemProps[]>

  constructor({
    config = { widgets: [], routing: { menuItems: [], routes: [] } },
  }: MedusaAppProps) {
    this.widgets = this.populateWidgets(config.widgets)
    this.menus = this.populateMenus(config.routing.menuItems)

    this.getMenu = this.getMenu.bind(this)
    this.getWidgets = this.getWidgets.bind(this)
  }

  private populateWidgets(widgets: WidgetExtension[]) {
    const registry = new Map<InjectionZone, React.ComponentType[]>()

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

  private populateMenus(menuItems: MenuItemExtension[]) {
    const registry = new Map<MenuItemPath, NavItemProps[]>()

    menuItems.forEach((item) => {
      const isSettingsPath = item.path.startsWith("/settings")
      const key = isSettingsPath ? "settingsExtensions" : "coreExtensions"

      if (!registry.has(key)) {
        registry.set(key, [])
      }

      registry.get(key)!.push({
        label: item.label,
        to: item.path,
        icon: item.icon ? <item.icon /> : undefined,
      })
    })

    return registry
  }

  getMenu(path: MenuItemPath) {
    return this.menus.get(path) || []
  }

  getWidgets(zone: InjectionZone) {
    return this.widgets.get(zone) || []
  }

  render() {
    return (
      <React.StrictMode>
        <App getMenu={this.getMenu} getWidgets={this.getWidgets} />
      </React.StrictMode>
    )
  }
}
