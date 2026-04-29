import {
  CheckConstraint,
  DMLSchema,
  EntityCascades,
  EntityIndex,
  ExtractEntityRelations,
  IDmlEntity,
  IDmlEntityConfig,
  InferDmlEntityNameFromConfig,
  PropertyType,
  QueryCondition,
} from "@medusajs/types"
import { isObject, isString, toCamelCase, upperCaseFirst } from "../common"
import { transformIndexWhere } from "./helpers/entity-builder/build-indexes"
import { DMLSchemaWithBigNumber } from "./helpers/entity-builder/create-big-number-properties"
import { DMLSchemaDefaults } from "./helpers/entity-builder/create-default-properties"
import { BelongsTo } from "./relations/belongs-to"

const IsDmlEntity = Symbol.for("isDmlEntity")

/**
 * Represents an entity with translatable properties
 */
export type TranslatableEntityEntry = {
  /**
   * The entity name (PascalCase)
   */
  entity: string
  /**
   * The list of translatable property names
   */
  fields: string[]
}

/**
 * Module-level storage for translatable entities using Map for O(1) lookups.
 * Keys are entity names (PascalCase), values are Sets of field names.
 *
 * @example
 * import { DmlEntity } from "@medusajs/framework/utils"
 *
 * const translatables = DmlEntity.getTranslatableEntities()
 * // Returns: [{ entity: "Store", fields: ["name"] }]
 */
const TRANSLATABLE_ENTITIES = new Map<string, Set<string>>()

export type DMLEntitySchemaBuilder<Schema extends DMLSchema> =
  DMLSchemaWithBigNumber<Schema> & DMLSchemaDefaults & Schema

function extractNameAndTableName<const Config extends IDmlEntityConfig>(
  nameOrConfig: Config
) {
  const result = {
    name: "",
    tableName: "",
  } as {
    name: InferDmlEntityNameFromConfig<Config>
    tableName: string
  }

  if (isString(nameOrConfig)) {
    const [schema, ...rest] = nameOrConfig.split(".")
    const name = rest.length ? rest.join(".") : schema
    result.name = upperCaseFirst(
      toCamelCase(name)
    ) as InferDmlEntityNameFromConfig<Config>

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

    result.name = upperCaseFirst(
      toCamelCase(name)
    ) as InferDmlEntityNameFromConfig<Config>
    result.tableName = nameOrConfig.tableName
  }

  return result
}

/**
 * Dml entity is a representation of a DML model with a unique
 * name, its schema and relationships.
 */
export class DmlEntity<
  const Schema extends DMLSchema,
  const TConfig extends IDmlEntityConfig
> implements IDmlEntity<Schema, TConfig>
{
  [IsDmlEntity] = true

  name: InferDmlEntityNameFromConfig<TConfig>
  schema: Schema

  readonly #tableName: string
  #cascades: EntityCascades<string[], string[]> = {}

  #indexes: EntityIndex<Schema>[] = []
  #checks: CheckConstraint<Schema>[] = []

  constructor(nameOrConfig: TConfig, schema: Schema) {
    const { name, tableName } = extractNameAndTableName(nameOrConfig)
    this.schema = schema
    this.name = name
    this.#tableName = tableName

    this.#registerTranslatableFields(name, schema)
  }

  /**
   * Collects translatable fields from the schema and registers them
   */
  #registerTranslatableFields(entityName: string, schema: Schema): void {
    for (const [fieldName, property] of Object.entries(schema)) {
      if (typeof (property as PropertyType<any>).parse !== "function") {
        continue
      }

      const parsed = (property as PropertyType<any>).parse(fieldName)
      if (!("fieldName" in parsed) || !parsed.dataType?.options?.translatable) {
        continue
      }

      // Get or create the Set for this entity
      const existingFields = TRANSLATABLE_ENTITIES.get(entityName)
      if (existingFields) {
        existingFields.add(fieldName)
      } else {
        TRANSLATABLE_ENTITIES.set(entityName, new Set([fieldName]))
      }
    }
  }

  /**
   * A static method to check if an entity is an instance of DmlEntity.
   * It allows us to identify a specific object as being an instance of
   * DmlEntity.
   *
   * @param entity
   */
  static isDmlEntity(entity: unknown): entity is DmlEntity<any, any> {
    return !!entity?.[IsDmlEntity]
  }

  /**
   * Returns all registered translatable entities with their translatable fields.
   * Each entry contains the entity name (PascalCase) and an array
   * of field names that are marked as translatable.
   *
   * @example
   * import { DmlEntity } from "@medusajs/framework/utils"
   *
   * const translatables = DmlEntity.getTranslatableEntities()
   * // Returns: [{ entity: "Store", fields: ["name"] }]
   *
   * @customNamespace Model Methods
   */
  static getTranslatableEntities(): TranslatableEntityEntry[] {
    return Array.from(TRANSLATABLE_ENTITIES.entries()).map(
      ([entity, fields]) => ({
        entity,
        fields: Array.from(fields),
      })
    )
  }

  /**
   * Clears all registered translatable entities.
   * This is primarily used for testing purposes.
   */
  static clearTranslatableEntities(): void {
    TRANSLATABLE_ENTITIES.clear()
  }

  /**
   * Parse entity to get its underlying information
   */
  parse(): {
    name: InferDmlEntityNameFromConfig<TConfig>
    tableName: string
    schema: DMLSchema
    cascades: EntityCascades<string[], string[]>
    indexes: EntityIndex<Schema>[]
    checks: CheckConstraint<Schema>[]
  } {
    return {
      name: this.name,
      tableName: this.#tableName,
      schema: this.schema,
      cascades: this.#cascades,
      indexes: this.#indexes,
      checks: this.#checks,
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
   * import { model } from "@medusajs/framework/utils"
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
      ExtractEntityRelations<Schema, "hasOne" | "hasOneWithFK" | "hasMany">,
      ExtractEntityRelations<Schema, "manyToMany">
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
   * import { model } from "@medusajs/framework/utils"
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
   * import { model } from "@medusajs/framework/utils"
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
   * import { model } from "@medusajs/framework/utils"
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

  checks(checks: CheckConstraint<Schema>[]) {
    this.#checks = checks
    return this
  }
}
