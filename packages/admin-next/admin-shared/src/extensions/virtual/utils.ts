import { InjectionZone } from "../widgets"

const PREFIX = "virtual:medusa/"

export const id = (name: string) => {
  return `${PREFIX}${name}`
}

export const resolve = (id: string) => {
  return `\0${id}`
}

export const url = (id: string) => {
  return `/@id/__x00__${id}`
}

export const getWidgetImport = (zone: InjectionZone) => {
  return `widgets/${zone.replace(/\./g, "/")}`
}

export const getWidgetZone = (resolvedId: string): InjectionZone => {
  const virtualPrefix = `\0${PREFIX}widgets/`

  const zone = resolvedId
    .replace(virtualPrefix, "")
    .replace(/\//g, ".") as InjectionZone

  return zone as InjectionZone
}
