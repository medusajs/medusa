import {
  SchemaType,
  EntityHooks,
  ExtractEntityRelations,
  RelationshipType,
} from "./types"

/**
 * Dml entity is a representation of a DML model with a unique
 * name, its schema and relationships.
 */
export class DmlEntity<
  Schema extends Record<string, SchemaType<any> | RelationshipType<any>>
> {
  #hooks: EntityHooks = {}
  constructor(public name: string, public schema: Schema) {}

  /**
   * Parse entity to get its underlying information
   */
  parse(): {
    name: string
    schema: SchemaType<any> | RelationshipType<any>
    hooks: EntityHooks
  } {
    return {
      name: this.name,
      schema: this.schema as unknown as SchemaType<any> | RelationshipType<any>,
      hooks: this.#hooks,
    }
  }

  /**
   * Delete actions to be performed when the entity is deleted. For example:
   *
   * You can configure relationship data to be deleted when the current
   * entity is deleted.
   */
  onDelete(options: { remove: ExtractEntityRelations<Schema> }) {
    if (!this.#hooks.deleted) {
      this.#hooks.deleted = {
        remove: options.remove,
      }
    } else {
      this.#hooks.deleted.remove.push(...options.remove)
    }

    return this
  }
}
