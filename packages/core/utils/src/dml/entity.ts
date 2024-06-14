import { BelongsTo } from "./relations/belongs-to"
import {
  SchemaType,
  EntityCascades,
  RelationshipType,
  ExtractEntityRelations,
} from "./types"

/**
 * Dml entity is a representation of a DML model with a unique
 * name, its schema and relationships.
 */
export class DmlEntity<
  Schema extends Record<string, SchemaType<any> | RelationshipType<any>>
> {
  #cascades: EntityCascades<string[]> = {}
  constructor(public name: string, public schema: Schema) {}

  /**
   * Parse entity to get its underlying information
   */
  parse(): {
    name: string
    schema: SchemaType<any> | RelationshipType<any>
    cascades: EntityCascades<string[]>
  } {
    return {
      name: this.name,
      schema: this.schema as unknown as SchemaType<any> | RelationshipType<any>,
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
