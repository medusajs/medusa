export enum Entities {
  tax_provider = "tax_provider",
}

export const defaults = ["id", "is_enabled"]

export const retrieveTransformQueryConfig = {
  defaults,
  isList: false,
  entity: Entities.tax_provider,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  isList: true,
  entity: Entities.tax_provider,
}
