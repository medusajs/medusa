import {
  CustomFieldContainerZone,
  CustomFieldFormTab,
  CustomFieldFormZone,
  CustomFieldModel,
} from "@medusajs/admin-shared"
import { ComponentType } from "react"
import type {
  CustomFieldConfiguration,
  DisplayDefinition,
  FormConfig,
  FormField,
  FormFieldDefinition,
  FormZoneMap,
  ModelConfigMap,
  ModelDisplayMap,
  ModelFormMap,
  ZoneConfigDefinition,
  ZoneFormsDefinition,
  ZoneStructure,
} from "./types"

export class CustomFieldRegistry {
  private fields: ModelFormMap = new Map()
  private configs: ModelConfigMap = new Map()
  private displays: ModelDisplayMap = new Map()

  constructor(customFields?: CustomFieldConfiguration) {
    this.processCustomFields(customFields)

    this.getFields = this.getFields.bind(this)
    this.getConfigs = this.getConfigs.bind(this)
    this.getDisplays = this.getDisplays.bind(this)
  }

  getFields(
    model: CustomFieldModel,
    zone: CustomFieldFormZone,
    tab?: CustomFieldFormTab
  ): FormField[] {
    const formZoneMap = this.fields.get(model)
    if (!formZoneMap) {
      return []
    }
    const zoneStructure = formZoneMap.get(zone)
    if (!zoneStructure) {
      return []
    }

    if (tab) {
      const tabFields = zoneStructure.tabs.get(tab)
      if (!tabFields) {
        return []
      }
      return tabFields
    }

    return zoneStructure.components
  }

  getDisplays(
    model: CustomFieldModel,
    zone: CustomFieldContainerZone
  ): ComponentType<{ data: any }>[] {
    const modelDisplays = this.displays.get(model)
    if (!modelDisplays) {
      return []
    }
    return modelDisplays.get(zone) || []
  }

  getConfigs(model: CustomFieldModel, zone: CustomFieldFormZone): FormConfig[] {
    const modelConfigs = this.configs.get(model)
    if (!modelConfigs) {
      return []
    }
    return modelConfigs.get(zone) || []
  }

  private processCustomFields(customFields?: CustomFieldConfiguration) {
    if (!customFields) {
      return
    }

    Object.entries(customFields).forEach(([model, customization]) => {
      this.processFields(model as CustomFieldModel, customization.forms)
      this.processConfigs(model as CustomFieldModel, customization.configs)
      this.processDisplays(model as CustomFieldModel, customization.displays)
    })
  }

  private processDisplays(
    model: CustomFieldModel,
    displays: DisplayDefinition[]
  ) {
    const modelDisplayMap = new Map<
      CustomFieldContainerZone,
      ComponentType<{ data: any }>[]
    >()
    this.displays.set(model, modelDisplayMap)

    displays.forEach((display) => {
      const { zone, Component } = display
      if (!modelDisplayMap.has(zone)) {
        modelDisplayMap.set(zone, [])
      }
      modelDisplayMap.get(zone)!.push(Component)
    })
  }

  private processConfigs(
    model: CustomFieldModel,
    configs: ZoneConfigDefinition[]
  ) {
    const modelConfigMap = new Map<CustomFieldFormZone, FormConfig[]>()
    this.configs.set(model, modelConfigMap)

    configs.forEach((configDef) => {
      const { zone, fields } = configDef
      const zoneConfigs: FormConfig[] = []

      Object.entries(fields).forEach(([name, config]) => {
        zoneConfigs.push({
          name,
          defaultValue: config.defaultValue,
          validation: config.validation,
        })
      })

      modelConfigMap.set(zone, zoneConfigs)
    })
  }

  private processFields(
    model: CustomFieldModel,
    fields: ZoneFormsDefinition[]
  ) {
    const formZoneMap: FormZoneMap = new Map()
    this.fields.set(model, formZoneMap)

    fields.forEach((fieldDef) =>
      this.processFieldDefinition(formZoneMap, fieldDef)
    )
  }

  private processFieldDefinition(
    formZoneMap: FormZoneMap,
    fieldDef: ZoneFormsDefinition
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
    fieldDefinition: FormFieldDefinition
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
}
