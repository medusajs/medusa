export const schemaObjectRepresentationPropertiesToOmit = [
  "_schemaPropertiesMap",
  "_serviceNameModuleConfigMap",
]

export type Select = {
  [key: string]: boolean | Select | Select[]
}

export type Where = {
  [key: string]: any
}

export type OrderBy = {
  [path: string]: OrderBy | "ASC" | "DESC" | 1 | -1 | true | false
}

export type QueryFormat = {
  select: Select
  where?: Where
  joinWhere?: Where
}

export type QueryOptions = {
  skip?: number
  take?: number
  orderBy?: OrderBy | OrderBy[]
  keepFilteredEntities?: boolean
}
