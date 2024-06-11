import { RelationshipType, SchemaType } from "./types"

export class DmlEntity<
  Schema extends Record<string, SchemaType<any> | RelationshipType<any>>
> {
  #name: string
  #schema: Schema

  constructor(name: string, schema: Schema) {
    this.#name = name
    this.#schema = schema
  }
}
