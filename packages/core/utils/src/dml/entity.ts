import { RelationshipType, SchemaType } from "./types"

export class DmlEntity<
  Schema extends Record<string, SchemaType<any> | RelationshipType<any>>
> {
  constructor(public name: string, public schema: Schema) {}
}
