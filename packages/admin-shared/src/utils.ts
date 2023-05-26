import { extensionTypes, injectionZones } from "./constants"
import {
  Extension,
  ExtensionType,
  InjectionZone,
  NestedRouteExtension,
  RouteExtension,
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

function isRouteExtension(extension: Extension): extension is RouteExtension {
  return extension.config.type === "route"
}

function isNestedRouteExtension(
  extension: Extension
): extension is NestedRouteExtension {
  return extension.config.type === "nested-route"
}

export {
  isValidExtensionType,
  isValidInjectionZone,
  isWidgetExtension,
  isRouteExtension,
  isNestedRouteExtension,
}
