import { extensionTypes, injectionZones } from "./constants"
import {
  Extension,
  ExtensionType,
  InjectionZone,
  PageExtension,
  WidgetExtension,
} from "./types"

function isValidExtensionType(val: any): val is ExtensionType {
  return extensionTypes.includes(val)
}

function isValidInjectionZone(val: any): val is InjectionZone {
  return injectionZones.includes(val)
}

function isWidgetExtension(extension: Extension): extension is WidgetExtension {
  return extension.config.type === "widget"
}

function isPageExtension(extension: Extension): extension is PageExtension {
  return extension.config.type === "page"
}

export {
  isValidExtensionType,
  isValidInjectionZone,
  isWidgetExtension,
  isPageExtension,
}
