export enum Entities {
  property_label = "property_label",
}

export const defaultPropertyLabelFields = [
  "id",
  "entity",
  "property",
  "label",
  "description",
  "created_at",
  "updated_at",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultPropertyLabelFields,
  isList: false,
  entity: Entities.property_label,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  isList: true,
}
