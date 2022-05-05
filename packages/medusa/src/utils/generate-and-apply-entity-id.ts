import { ulid } from "ulid"

/**
 * Generate a composed id based on the input parameters and return false only if the id already exists which means no action to do.
 * @param entity
 * @param targetIdColumnName
 * @param prefix
 */
export function generateAndApplyEntityId<TEntity extends Object>(entity: TEntity, targetIdColumnName: string, prefix?: string): void | false {
  if (entity[targetIdColumnName]) {
    return false
  }

  const id = ulid()
  prefix = prefix ? `${prefix}_` : ''
  entity[targetIdColumnName] = `${prefix}${id}`
}