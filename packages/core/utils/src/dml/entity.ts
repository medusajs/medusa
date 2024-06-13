import { RelationshipType, SchemaType } from "./types"

/**
 * Dml entity is a representation of a DML model with a unique
 * name, its schema and relationships.
 */
export class DmlEntity<
  Schema extends Record<string, SchemaType<any> | RelationshipType<any>>
> {
  constructor(public name: string, public schema: Schema) {}
}
