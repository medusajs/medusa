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
  ConfigExtension,
  ConfigField,
  ConfigFieldMap,
  DisplayExtension,
  DisplayMap,
  DisplayModule,
  FormExtension,
  FormField,
  FormFieldExtension,
  FormFieldMap,
  FormModule,
  FormZoneMap,
  MenuItemExtension,
  MenuItemKey,
  MenuItemModule,
  WidgetExtension,
  WidgetModule,
  ZoneStructure,
} from "../types"

export type DashboardExtensionManagerProps = {
  formModule: FormModule
  displayModule: DisplayModule
  menuItemModule: MenuItemModule
  widgetModule: WidgetModule
}

export class DashboardExtensionManager {
  private widgets: Map<InjectionZone, React.ComponentType[]>
  private menus: Map<MenuItemKey, INavItem[]>
  private fields: FormFieldMap
  private configs: ConfigFieldMap
  private displays: DisplayMap

  constructor({
    widgetModule,
    menuItemModule,
    displayModule,
    formModule,
  }: DashboardExtensionManagerProps) {
    this.widgets = this.populateWidgets(widgetModule.widgets)
    this.menus = this.populateMenus(menuItemModule.menuItems)

    const { fields, configs } = this.populateForm(formModule)
    this.fields = fields
    this.configs = configs
    this.displays = this.populateDisplays(displayModule)
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
    const registry = new Map<MenuItemKey, INavItem[]>()
    const tempRegistry: Record<string, INavItem> = {}

    if (!menuItems) {
      return registry
    }

    menuItems.sort((a, b) => a.path.length - b.path.length)

    menuItems.forEach((item) => {
      if (item.path.includes("/:")) {
        if (process.env.NODE_ENV === "development") {
          console.warn(
            `[@medusajs/dashboard] Menu item for path "${item.path}" can't be added to the sidebar as it contains a parameter.`
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

      const navItem: INavItem = {
        label: item.label,
        to: item.path,
        icon: item.icon ? <item.icon /> : undefined,
        items: [],
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

    return registry
  }

  private populateForm(formModule: FormModule): {
    fields: FormFieldMap
    configs: ConfigFieldMap
  } {
    const fields: FormFieldMap = new Map()
    const configs: ConfigFieldMap = new Map()

    Object.entries(formModule.customFields).forEach(
      ([model, customization]) => {
        fields.set(
          model as CustomFieldModel,
          this.processFields(customization.forms)
        )
        configs.set(
          model as CustomFieldModel,
          this.processConfigs(customization.configs)
        )
      }
    )

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

  private populateDisplays(displayModule: DisplayModule): DisplayMap {
    const displays = new Map<
      CustomFieldModel,
      Map<CustomFieldContainerZone, React.ComponentType<{ data: any }>[]>
    >()

    Object.entries(displayModule.displays).forEach(([model, customization]) => {
      displays.set(
        model as CustomFieldModel,
        this.processDisplays(customization)
      )
    })

    return displays
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
