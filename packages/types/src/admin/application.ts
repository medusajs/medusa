import {
  DomainKey,
  HookPointKey,
  LoadedWidget,
  PageKey,
  PagePointKey,
  StumbDomainKey,
  WidgetsConfig,
} from "./widget"

export type InjectionZone =
  | `${DomainKey}.${HookPointKey}`
  | `${PageKey}.${PagePointKey}`
  | `${StumbDomainKey}`

export type InjectionZones = Map<InjectionZone, LoadedWidget[]>

export interface Application {
  registerWidgets(identifier: string, config: WidgetsConfig): void
}
