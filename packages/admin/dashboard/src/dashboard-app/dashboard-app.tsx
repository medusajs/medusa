import {
  CustomFieldContainerZone,
  CustomFieldFormTab,
  CustomFieldFormZone,
  CustomFieldModel,
  deepMerge,
  InjectionZone,
  NESTED_ROUTE_POSITIONS,
} from "@medusajs/admin-shared"
import * as React from "react"
import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from "react-router-dom"
import { INavItem } from "../components/layout/nav-item"
import { Providers } from "../providers"
import coreTranslations from "../i18n/translations"
import { getRouteMap } from "./routes/get-route.map"
import { createRouteMap, getRouteExtensions } from "./routes/utils"
import { sortMenuItemsByRank } from "./utils/sort-menu-items-by-rank"
import {
  ConfigExtension,
  ConfigField,
  ConfigFieldMap,
  DashboardPlugin,
  DisplayExtension,
  DisplayMap,
  FormExtension,
  FormField,
  FormFieldExtension,
  FormFieldMap,
  FormZoneMap,
  I18nExtension,
  MenuItemExtension,
  MenuItemKey,
  MenuMap,
  WidgetMap,
  ZoneStructure,
} from "./types"

type DashboardAppProps = {
  plugins: DashboardPlugin[]
}

/**
 * Matches segments that are optional and at the end of the path.
 * Example: /path/to/:id?
 * Such paths can be added to the menu items without the optional segment.
 */
const OPTIONAL_LAST_SEGMENT_MATCH = /\/([^\/])+\?$/

export class DashboardApp {
  private widgets: WidgetMap
  private menus: MenuMap
  private fields: FormFieldMap
  private configs: ConfigFieldMap
  private displays: DisplayMap
  private coreRoutes: RouteObject[]
  private settingsRoutes: RouteObject[]
  private i18nResources: I18nExtension

  constructor({ plugins }: DashboardAppProps) {
    this.widgets = this.populateWidgets(plugins)
    this.menus = this.populateMenus(plugins)

    const { coreRoutes, settingsRoutes } = this.populateRoutes(plugins)
    this.coreRoutes = coreRoutes
    this.settingsRoutes = settingsRoutes

    const { fields, configs } = this.populateForm(plugins)
    this.fields = fields
    this.configs = configs
    this.displays = this.populateDisplays(plugins)
    this.i18nResources = this.populateI18n(plugins)
  }

  private populateRoutes(plugins: DashboardPlugin[]) {
    const coreRoutes: RouteObject[] = []
    const settingsRoutes: RouteObject[] = []

    for (const plugin of plugins) {
      const filteredCoreRoutes = getRouteExtensions(plugin.routeModule, "core")
      const filteredSettingsRoutes = getRouteExtensions(
        plugin.routeModule,
        "settings"
      )

      const coreRoutesMap = createRouteMap(filteredCoreRoutes)
      const settingsRoutesMap = createRouteMap(filteredSettingsRoutes)

      coreRoutes.push(...coreRoutesMap)
      settingsRoutes.push(...settingsRoutesMap)
    }

    return { coreRoutes, settingsRoutes }
  }

  private populateWidgets(plugins: DashboardPlugin[]) {
    const registry = new Map<InjectionZone, React.ComponentType[]>()

    plugins.forEach((plugin) => {
      const widgets = plugin.widgetModule.widgets
      if (!widgets) {
        return
      }

      widgets.forEach((widget) => {
        widget.zone.forEach((zone) => {
          if (!registry.has(zone)) {
            registry.set(zone, [])
          }
          registry.get(zone)!.push(widget.Component)
        })
      })
    })

    return registry
  }

  private populateMenus(plugins: DashboardPlugin[]) {
    const registry = new Map<MenuItemKey, INavItem[]>()
    const tempRegistry: Record<string, INavItem> = {}

    // Collect all menu items from all plugins
    const allMenuItems: MenuItemExtension[] = []
    plugins.forEach((plugin) => {
      if (plugin.menuItemModule.menuItems) {
        allMenuItems.push(...plugin.menuItemModule.menuItems)
      }
    })

    if (allMenuItems.length === 0) {
      return registry
    }

    allMenuItems.sort((a, b) => a.path.length - b.path.length)

    allMenuItems.forEach((item) => {
      item.path = item.path.replace(OPTIONAL_LAST_SEGMENT_MATCH, "")
      if (item.path.includes("/:") || item.path.endsWith("/*")) {
        if (process.env.NODE_ENV === "development") {
          console.warn(
            `[@medusajs/dashboard] Menu item for path "${item.path}" can't be added to the sidebar as it contains a mandatory parameter.`
          )
        }
        return
      }

      const isSettingsPath = item.path.startsWith("/settings")
      const key = isSettingsPath ? "settingsExtensions" : "coreExtensions"

      const pathParts = item.path.split("/").filter(Boolean)
      const parentPath = "/" + pathParts.slice(0, -1).join("/")

      // Check if this is a nested settings path
      if (isSettingsPath && pathParts.length > 2) {
        if (process.env.NODE_ENV === "development") {
          console.warn(
            `[@medusajs/dashboard] Nested settings menu item "${item.path}" can't be added to the sidebar. Only top-level settings items are allowed.`
          )
        }
        return // Skip this item entirely
      }

      // Find the parent item if it exists
      const parentItem = allMenuItems.find(
        (menuItem) => menuItem.path === parentPath
      )

      // Check if parent item is a nested route under existing route
      if (
        parentItem?.nested &&
        NESTED_ROUTE_POSITIONS.includes(parentItem?.nested) &&
        pathParts.length > 1
      ) {
        if (process.env.NODE_ENV === "development") {
          console.warn(
            `[@medusajs/dashboard] Nested menu item "${item.path}" can't be added to the sidebar as it is nested under "${parentItem.nested}".`
          )
        }
        return
      }

      const navItem: INavItem & { rank?: number } = {
        label: item.label,
        to: item.path,
        icon: item.icon ? <item.icon /> : undefined,
        items: [],
        nested: item.nested,
        rank: item.rank,
        translationNs: item.translationNs,
      }

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

    // Sort menu items by rank (ascending order, undefined ranks come last)
    registry.forEach((items, key) => {
      const sorted = sortMenuItemsByRank(items)
      registry.set(key, sorted)
    })

    return registry
  }

  private populateForm(plugins: DashboardPlugin[]): {
    fields: FormFieldMap
    configs: ConfigFieldMap
  } {
    const fields: FormFieldMap = new Map()
    const configs: ConfigFieldMap = new Map()

    plugins.forEach((plugin) => {
      Object.entries(plugin.formModule.customFields).forEach(
        ([model, customization]) => {
          // Initialize maps if they don't exist for this model
          if (!fields.has(model as CustomFieldModel)) {
            fields.set(model as CustomFieldModel, new Map())
          }
          if (!configs.has(model as CustomFieldModel)) {
            configs.set(model as CustomFieldModel, new Map())
          }

          // Process forms
          const modelFields = this.processFields(customization.forms)
          const existingModelFields = fields.get(model as CustomFieldModel)!

          // Merge the maps
          modelFields.forEach((zoneStructure, zone) => {
            if (!existingModelFields.has(zone)) {
              existingModelFields.set(zone, { components: [], tabs: new Map() })
            }

            const existingZoneStructure = existingModelFields.get(zone)!

            // Merge components
            existingZoneStructure.components.push(...zoneStructure.components)

            // Merge tabs
            zoneStructure.tabs.forEach((fields, tab) => {
              if (!existingZoneStructure.tabs.has(tab)) {
                existingZoneStructure.tabs.set(tab, [])
              }
              existingZoneStructure.tabs.get(tab)!.push(...fields)
            })
          })

          // Process configs
          const modelConfigs = this.processConfigs(customization.configs)
          const existingModelConfigs = configs.get(model as CustomFieldModel)!

          // Merge the config maps
          modelConfigs.forEach((configFields, zone) => {
            if (!existingModelConfigs.has(zone)) {
              existingModelConfigs.set(zone, [])
            }
            existingModelConfigs.get(zone)!.push(...configFields)
          })
        }
      )
    })

    return { fields, configs }
  }

  private processFields(forms: FormExtension[]): FormZoneMap {
    const formZoneMap: FormZoneMap = new Map()

    forms.forEach((fieldDef) =>
      this.processFieldDefinition(formZoneMap, fieldDef)
    )

    return formZoneMap
  }

  private processConfigs(
    configs: ConfigExtension[]
  ): Map<CustomFieldFormZone, ConfigField[]> {
    const modelConfigMap = new Map<CustomFieldFormZone, ConfigField[]>()

    configs.forEach((configDef) => {
      const { zone, fields } = configDef
      const zoneConfigs: ConfigField[] = []

      Object.entries(fields).forEach(([name, config]) => {
        zoneConfigs.push({
          name,
          defaultValue: config.defaultValue,
          validation: config.validation,
        })
      })

      modelConfigMap.set(zone, zoneConfigs)
    })

    return modelConfigMap
  }

  private processFieldDefinition(
    formZoneMap: FormZoneMap,
    fieldDef: FormExtension
  ) {
    const { zone, tab, fields: fieldsDefinition } = fieldDef
    const zoneStructure = this.getOrCreateZoneStructure(formZoneMap, zone)

    Object.entries(fieldsDefinition).forEach(([fieldKey, fieldDefinition]) => {
      const formField = this.createFormField(fieldKey, fieldDefinition)
      this.addFormFieldToZoneStructure(zoneStructure, formField, tab)
    })
  }

  private getOrCreateZoneStructure(
    formZoneMap: FormZoneMap,
    zone: CustomFieldFormZone
  ): ZoneStructure {
    let zoneStructure = formZoneMap.get(zone)
    if (!zoneStructure) {
      zoneStructure = { components: [], tabs: new Map() }
      formZoneMap.set(zone, zoneStructure)
    }
    return zoneStructure
  }

  private createFormField(
    fieldKey: string,
    fieldDefinition: FormFieldExtension
  ): FormField {
    return {
      name: fieldKey,
      validation: fieldDefinition.validation,
      label: fieldDefinition.label,
      description: fieldDefinition.description,
      Component: fieldDefinition.Component,
    }
  }

  private addFormFieldToZoneStructure(
    zoneStructure: ZoneStructure,
    formField: FormField,
    tab?: CustomFieldFormTab
  ) {
    if (tab) {
      let tabFields = zoneStructure.tabs.get(tab)
      if (!tabFields) {
        tabFields = []
        zoneStructure.tabs.set(tab, tabFields)
      }
      tabFields.push(formField)
    } else {
      zoneStructure.components.push(formField)
    }
  }

  private populateDisplays(plugins: DashboardPlugin[]): DisplayMap {
    const displays = new Map<
      CustomFieldModel,
      Map<CustomFieldContainerZone, React.ComponentType<{ data: any }>[]>
    >()

    plugins.forEach((plugin) => {
      Object.entries(plugin.displayModule.displays).forEach(
        ([model, customization]) => {
          if (!displays.has(model as CustomFieldModel)) {
            displays.set(
              model as CustomFieldModel,
              new Map<
                CustomFieldContainerZone,
                React.ComponentType<{ data: any }>[]
              >()
            )
          }

          const modelDisplays = displays.get(model as CustomFieldModel)!
          const processedDisplays = this.processDisplays(customization)

          // Merge the displays
          processedDisplays.forEach((components, zone) => {
            if (!modelDisplays.has(zone)) {
              modelDisplays.set(zone, [])
            }
            modelDisplays.get(zone)!.push(...components)
          })
        }
      )
    })

    return displays
  }

  private populateI18n(
    plugins: DashboardPlugin[]
  ): I18nExtension {
    let resources: I18nExtension = { ...coreTranslations }

    for (const plugin of plugins) {
      resources = deepMerge(resources, plugin.i18nModule?.resources)
    }

    return resources
  }

  private processDisplays(
    displays: DisplayExtension[]
  ): Map<CustomFieldContainerZone, React.ComponentType<{ data: any }>[]> {
    const modelDisplayMap = new Map<
      CustomFieldContainerZone,
      React.ComponentType<{ data: any }>[]
    >()

    displays.forEach((display) => {
      const { zone, Component } = display
      if (!modelDisplayMap.has(zone)) {
        modelDisplayMap.set(zone, [])
      }
      modelDisplayMap.get(zone)!.push(Component)
    })

    return modelDisplayMap
  }

  private getMenu(path: MenuItemKey) {
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
    const zoneMap = this.fields.get(model)?.get(zone)

    if (!zoneMap) {
      return []
    }

    if (tab) {
      return zoneMap.tabs.get(tab) || []
    }

    return zoneMap.components
  }

  private getFormConfigs(model: CustomFieldModel, zone: CustomFieldFormZone) {
    return this.configs.get(model)?.get(zone) || []
  }

  private getDisplays(model: CustomFieldModel, zone: CustomFieldContainerZone) {
    return this.displays.get(model)?.get(zone) || []
  }

  private getI18nResources() {
    return this.i18nResources
  }

  get api() {
    return {
      getMenu: this.getMenu.bind(this),
      getWidgets: this.getWidgets.bind(this),
      getFormFields: this.getFormFields.bind(this),
      getFormConfigs: this.getFormConfigs.bind(this),
      getDisplays: this.getDisplays.bind(this),
      getI18nResources: this.getI18nResources.bind(this),
    }
  }

  render() {
    const routes = getRouteMap({
      settingsRoutes: this.settingsRoutes,
      coreRoutes: this.coreRoutes,
    })

    const router = createBrowserRouter(routes, {
      basename: __BASE__ || "/",
    })

    return (
      <Providers api={this.api}>
        <RouterProvider router={router} />
      </Providers>
    )
  }
}
