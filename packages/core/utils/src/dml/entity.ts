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
  #cascades: EntityCascades<ExtractEntityRelations<Schema>> = {}
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
      cascades: this.#cascades as unknown as EntityCascades<string[]>,
    }
  }

  /**
   * Delete actions to be performed when the entity is deleted. For example:
   *
   * You can configure relationship data to be deleted when the current
   * entity is deleted.
   */
  cascades(options: EntityCascades<ExtractEntityRelations<Schema>>) {
    this.#cascades = options
    return this
  }
}
