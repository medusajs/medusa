import {
  DMLSchema,
  EntityCascades,
  EntityIndex,
  ExtractEntityRelations,
  IDmlEntity,
  IsDmlEntity,
  QueryCondition,
} from "@medusajs/types"
import { isObject, isString, toCamelCase } from "../common"
import { transformIndexWhere } from "./helpers/entity-builder/build-indexes"
import { BelongsTo } from "./relations/belongs-to"

type Config = string | { name?: string; tableName: string }

function extractNameAndTableName(nameOrConfig: Config) {
  const result = {
    name: "",
    tableName: "",
  }

  if (isString(nameOrConfig)) {
    const [schema, ...rest] = nameOrConfig.split(".")
    const name = rest.length ? rest.join(".") : schema
    result.name = toCamelCase(name)
    result.tableName = nameOrConfig
  }

  if (isObject(nameOrConfig)) {
    if (!nameOrConfig.tableName) {
      throw new Error(
        `Missing "tableName" property in the config object for "${nameOrConfig.name}" entity`
      )
    }

    const potentialName = nameOrConfig.name ?? nameOrConfig.tableName
    const [schema, ...rest] = potentialName.split(".")
    const name = rest.length ? rest.join(".") : schema

    result.name = toCamelCase(name)
    result.tableName = nameOrConfig.tableName
  }

  return result
}

/**
 * Dml entity is a representation of a DML model with a unique
 * name, its schema and relationships.
 */
export class DmlEntity<Schema extends DMLSchema> implements IDmlEntity<Schema> {
  [IsDmlEntity]: true = true

  name: string

  readonly #tableName: string
  #cascades: EntityCascades<string[]> = {}
  #indexes: EntityIndex<Schema>[] = []

  constructor(nameOrConfig: Config, public schema: Schema) {
    const { name, tableName } = extractNameAndTableName(nameOrConfig)
    this.name = name
    this.#tableName = tableName
  }

  /**
   * A static method to check if an entity is an instance of DmlEntity.
   * It allows us to identify a specific object as being an instance of
   * DmlEntity.
   *
   * @param entity
   */
  static isDmlEntity(entity: unknown): entity is DmlEntity<any> {
    return !!entity?.[IsDmlEntity]
  }

  /**
   * Parse entity to get its underlying information
   */
  parse(): {
    name: string
    tableName: string
    schema: DMLSchema
    cascades: EntityCascades<string[]>
    indexes: EntityIndex<Schema>[]
  } {
    return {
      name: this.name,
      tableName: this.#tableName,
      schema: this.schema,
      cascades: this.#cascades,
      indexes: this.#indexes,
    }
  }

  /**
   * This method configures which related data models an operation, such as deletion,
   * should be cascaded to.
   * 
   * For example, if a store is deleted, its product should also be deleted.
   * 
   * @param options - The cascades configurations. They object's keys are the names of
   * the actions, such as `deleted`, and the value is an array of relations that the 
   * action should be cascaded to.
   * 
   * @example
   * import { model } from "@medusajs/utils"
   * 
   * const Store = model.define("store", {
   *   id: model.id(),
   *   products: model.hasMany(() => Product),
   * })
   * .cascades({
   *   delete: ["products"],
   * })
   * 
   * @customNamespace Model Methods
   */
  cascades(
    options: EntityCascades<
      ExtractEntityRelations<Schema, "hasOne" | "hasMany">
    >
  ) {
    const childToParentCascades = options.delete?.filter((relationship) => {
      return BelongsTo.isBelongsTo(this.schema[relationship])
    })

    if (childToParentCascades?.length) {
      throw new Error(
        `Cannot cascade delete "${childToParentCascades.join(
          ", "
        )}" relationship(s) from "${
          this.name
        }" entity. Child to parent cascades are not allowed`
      )
    }

    this.#cascades = options
    return this
  }

  /**
   * This method defines indices on the data model. An index can be on multiple columns
   * and have conditions.
   * 
   * @param indexes - The index's configuration.
   * 
   * @example
   * An example of a simple index:
   * 
   * ```ts
   * import { model } from "@medusajs/utils"
   * 
   * const MyCustom = model.define("my_custom", {
   *   id: model.id(),
   *   name: model.text(),
   *   age: model.number()
   * }).indexes([
   *   {
   *     on: ["name", "age"],
   *   },
   * ])
   * 
   * export default MyCustom
   * ```
   * 
   * To add a condition on the index, use the `where` option:
   * 
   * ```ts
   * import { model } from "@medusajs/utils"
   * 
   * const MyCustom = model.define("my_custom", {
   *   id: model.id(),
   *   name: model.text(),
   *   age: model.number()
   * }).indexes([
   *   {
   *     on: ["name", "age"],
   *     where: {
   *       age: 30
   *     }
   *   },
   * ])
   * 
   * export default MyCustom
   * ```
   * 
   * The condition can also be a negation. For example:
   * 
   * ```ts
   * import { model } from "@medusajs/utils"
   * 
   * const MyCustom = model.define("my_custom", {
   *   id: model.id(),
   *   name: model.text(),
   *   age: model.number()
   * }).indexes([
   *   {
   *     on: ["name", "age"],
   *     where: {
   *       age: {
   *         $ne: 30
   *       }
   *     }
   *   },
   * ])
   * 
   * export default MyCustom
   * ```
   * 
   * In this example, the index is created when the value of `age` doesn't equal `30`.
   * 
   * @customNamespace Model Methods
   */
  indexes(indexes: EntityIndex<Schema, string | QueryCondition<Schema>>[]) {
    for (const index of indexes) {
      index.where = transformIndexWhere<Schema>(index)
      index.unique ??= false
    }

    this.#indexes = indexes as EntityIndex<Schema>[]
    return this
  }
}
