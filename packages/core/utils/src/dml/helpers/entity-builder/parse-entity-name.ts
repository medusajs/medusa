import { DmlEntity } from "../../entity"
import { camelToSnakeCase, toCamelCase, upperCaseFirst } from "../../../common"

/**
 * Parses entity name and returns model and table name from
 * it
 */
export function parseEntityName(entity: DmlEntity<any>) {
  const parsedEntity = entity.parse()

  /**
   * Table name is going to be the snake case version of the entity name.
   * Here we should preserve PG schema (if defined).
   *
   * For example: "platform.user" should stay as "platform.user"
   */
  const tableName = camelToSnakeCase(parsedEntity.tableName)

  /**
   * Entity name is going to be the camelCase version of the
   * name defined by the user
   */
  const [pgSchema, ...rest] = tableName.split(".")
  return {
    tableName,
    modelName: upperCaseFirst(toCamelCase(parsedEntity.name)),
    pgSchema: rest.length ? pgSchema : undefined,
  }
}
