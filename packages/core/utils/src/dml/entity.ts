import { BelongsTo } from "./relations/belongs-to"
import {
  EntityCascades,
  ExtractEntityRelations,
  PropertyType,
  RelationshipType,
} from "./types"

/**
 * Dml entity is a representation of a DML model with a unique
 * name, its schema and relationships.
 */
export class DmlEntity<
  Schema extends Record<string, PropertyType<any> | RelationshipType<any>>
> {
  static __dmlEntitySymbol__ = Symbol("DmlEntity")

  #cascades: EntityCascades<string[]> = {}
  constructor(public name: string, public schema: Schema) {}

  /**
   * A static method to check if an entity is an instance of DmlEntity.
   * It allows us to identify a specific object as being an instance of
   * DmlEntity.
   *
   * @param entity
   */
  static isDmlEntity(entity: any): entity is DmlEntity<any> {
    return (
      entity instanceof DmlEntity ||
      entity.constructor?.__dmlEntitySymbol__ === this.__dmlEntitySymbol__
    )
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
      return this.schema[relationship] instanceof BelongsTo
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
