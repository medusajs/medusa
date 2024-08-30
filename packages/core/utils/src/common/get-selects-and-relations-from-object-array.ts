import { deduplicate } from "./deduplicate"
import { isObject } from "./is-object"

const KEYS_THAT_ARE_NOT_RELATIONS = ["metadata"]

export function getSelectsAndRelationsFromObjectArray(
  dataArray: object[],
  options: { objectFields: string[] } = {
    objectFields: [],
  },
  prefix?: string
): {
  selects: string[]
  relations: string[]
} {
  const selects: string[] = []
  const relations: string[] = []

  for (const data of dataArray) {
    for (const [key, value] of Object.entries(data)) {
      if (isObject(value) && !options.objectFields.includes(key)) {
        const res = getSelectsAndRelationsFromObjectArray(
          [value],
          options,
          setKey(key, prefix)
        )
        selects.push(...res.selects)

        if (!KEYS_THAT_ARE_NOT_RELATIONS.includes(key)) {
          relations.push(setKey(key, prefix))
          relations.push(...res.relations)
        }
      } else if (Array.isArray(value)) {
        const res = getSelectsAndRelationsFromObjectArray(
          value,
          options,
          setKey(key, prefix)
        )
        selects.push(...res.selects)

        if (!KEYS_THAT_ARE_NOT_RELATIONS.includes(key)) {
          relations.push(setKey(key, prefix))
          relations.push(...res.relations)
        }
      } else {
        selects.push(setKey(key, prefix))
      }
    }
  }

  const uniqueSelects: string[] = deduplicate(selects)
  const uniqueRelations: string[] = deduplicate(relations)

  return {
    selects: uniqueSelects,
    relations: uniqueRelations,
  }
}

function setKey(key: string, prefix?: string) {
  if (prefix) {
    return `${prefix}.${key}`
  } else {
    return key
  }
}
