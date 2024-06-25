import {
  EntityCascades,
  ExtractEntityRelations,
  IDmlEntity,
  IsDmlEntity,
  PropertyType,
  RelationshipType,
} from "@medusajs/types"
import { DMLSchema } from "./entity-builder"
import { BelongsTo } from "./relations/belongs-to"

/**
 * Dml entity is a representation of a DML model with a unique
 * name, its schema and relationships.
 */
export class DmlEntity<Schema extends DMLSchema> implements IDmlEntity<Schema> {
  [IsDmlEntity]: true = true

  #cascades: EntityCascades<string[]> = {}
  constructor(public name: string, public schema: Schema) {}

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
    schema: PropertyType<any> | RelationshipType<any>
    cascades: EntityCascades<string[]>
  } {
    return {
      name: this.name,
      schema: this.schema as unknown as
        | PropertyType<any>
        | RelationshipType<any>,
      cascades: this.#cascades,
    }
  }

  /**
   * Delete actions to be performed when the entity is deleted. For example:
   *
   * You can configure relationship data to be deleted when the current
   * entity is deleted.
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
}
