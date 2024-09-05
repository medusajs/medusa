import { ContainerId } from "../details"
import { FormId } from "../forms"
import { InjectionZone } from "../widgets"

const PREFIX = "virtual:medusa/"

export const getVirtualId = (name: string) => {
  return `${PREFIX}${name}`
}

export const resolveVirtualId = (id: string) => {
  return `\0${id}`
}

function getIdentifierFromResolvedId<T,>(resolvedId: string, type: string) {
  const virtualPrefix = `\0${PREFIX}${type}/`

  const identifier = resolvedId
    .replace(virtualPrefix, "")
    .replace(/\//g, ".")

  return identifier as T
}

function getImport<T extends string>(identifier: T, type: string) {
  return `${type}/${identifier.replace(/\./g, "/")}` 
}

export const getWidgetImport = (zone: InjectionZone) => {
  return getImport(zone, "widgets")
}

export const getWidgetZone = (resolvedId: string): InjectionZone => {
  return getIdentifierFromResolvedId<InjectionZone>(resolvedId, "widgets")
}

export const getFormImport = (form: FormId) => {
  return getImport(form, "forms")
}

export const getFormId = (resolvedId: string): FormId => {
  return getIdentifierFromResolvedId<FormId>(resolvedId, "forms")
}

export const getContainerImport = (container: string) => {
  return getImport(container, "details")
}

export const getContainerId = (resolvedId: string): ContainerId => {
  return getIdentifierFromResolvedId<ContainerId>(resolvedId, "details")
}

