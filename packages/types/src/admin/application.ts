import { DomainKey, HookPointKey, LoadedWidget, WidgetsConfig } from "./widget"

export type InjectionZone = `${DomainKey}.${HookPointKey}`

export type InjectionZones = Map<InjectionZone, LoadedWidget[]>

export interface Application {
  registerWidgets(identifier: string, config: WidgetsConfig): void
}
