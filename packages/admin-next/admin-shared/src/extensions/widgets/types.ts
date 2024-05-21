import { INJECTION_ZONES } from "./constants"

export type InjectionZone = (typeof INJECTION_ZONES)[number]

export type WidgetConfig = {
  zone: InjectionZone | InjectionZone[]
}
