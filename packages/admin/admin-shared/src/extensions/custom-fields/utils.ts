import {
  CUSTOM_FIELD_CONTAINER_ZONES,
  CUSTOM_FIELD_DISPLAY_PATHS,
  CUSTOM_FIELD_FORM_CONFIG_PATHS,
  CUSTOM_FIELD_FORM_FIELD_PATHS,
  CUSTOM_FIELD_FORM_TABS,
  CUSTOM_FIELD_FORM_ZONES,
  CUSTOM_FIELD_LINK_PATHS,
  CUSTOM_FIELD_MODELS,
} from "./constants"
import {
  CustomFieldContainerZone,
  CustomFieldFormTab,
  CustomFieldFormZone,
  CustomFieldModel,
} from "./types"

// Validators for individual segments of the custom field extension system

export function isValidCustomFieldModel(id: any): id is CustomFieldModel {
  return CUSTOM_FIELD_MODELS.includes(id)
}

export function isValidCustomFieldFormZone(id: any): id is CustomFieldFormZone {
  return CUSTOM_FIELD_FORM_ZONES.includes(id)
}

export function isValidCustomFieldFormTab(id: any): id is CustomFieldFormTab {
  return CUSTOM_FIELD_FORM_TABS.includes(id)
}

export function isValidCustomFieldDisplayZone(
  id: any
): id is CustomFieldContainerZone {
  return CUSTOM_FIELD_CONTAINER_ZONES.includes(id)
}

// Validators for full paths of custom field extensions

export function isValidCustomFieldDisplayPath(id: any): id is string {
  return CUSTOM_FIELD_DISPLAY_PATHS.includes(id)
}

export function isValidCustomFieldFormConfigPath(id: any): id is string {
  return CUSTOM_FIELD_FORM_CONFIG_PATHS.includes(id)
}

export function isValidCustomFieldFormFieldPath(id: any): id is string {
  return CUSTOM_FIELD_FORM_FIELD_PATHS.includes(id)
}

export function isValidCustomFieldLinkPath(id: any): id is string {
  return CUSTOM_FIELD_LINK_PATHS.includes(id)
}
