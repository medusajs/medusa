import { InjectionZone } from "../widgets"

const PREFIX = "virtual:medusa/"

export function getVirtualId(name: string) {
  return `${PREFIX}${name}`
}

export function resolveVirtualId(id: string) {
  return `\0${id}`
}

export function getIdentifierFromResolvedId<T>(
  resolvedId: string,
  type: string
) {
  const virtualPrefix = `\0${PREFIX}${type}/`

  const identifier = resolvedId.replace(virtualPrefix, "").replace(/\//g, ".")

  return identifier as T
}

function getImport<T extends string>(identifier: T, type: string) {
  return `${type}/${identifier.replace(/\./g, "/")}`
}

export function getWidgetImport(zone: InjectionZone) {
  return getImport(zone, "widgets")
}

export function getWidgetZone(resolvedId: string): InjectionZone {
  return getIdentifierFromResolvedId<InjectionZone>(resolvedId, "widgets")
}

export function getCustomFieldImport(identifier: string) {
  return getImport(identifier, `custom-fields`)
}

export function getCustomFieldPath(identifier: string) {
  return `custom-fields/${identifier}`
}
