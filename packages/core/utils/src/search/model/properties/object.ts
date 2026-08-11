import {
  InferSearchObjectValue,
  SearchArrayMarker,
  SearchPropertyMetadata,
  SearchSchema,
} from "@medusajs/types"
import { ScalarSearchProperty } from "./base"

export class ObjectProperty<
  Schema extends SearchSchema
> extends ScalarSearchProperty<InferSearchObjectValue<Schema>> {
  protected dataType: { name: "object"; options?: Record<string, any> } = {
    name: "object",
  }

  #correlated?: boolean
  #fields: Schema

  constructor(fields: Schema) {
    super()
    this.#fields = fields
  }

  // Correlated filtering only means anything on an array of objects, so the
  // receiver must have gone through `.array()` first.
  correlated(
    this: ObjectProperty<Schema> & SearchArrayMarker,
    value: boolean = true
  ) {
    this.#correlated = value
    return this
  }

  parse(fieldName: string): SearchPropertyMetadata {
    const metadata = super.parse(fieldName)
    const fields: Record<string, SearchPropertyMetadata> = {}

    for (const [name, property] of Object.entries(this.#fields)) {
      fields[name] = property.parse(name)
    }

    if (this.#correlated !== undefined) {
      metadata.correlated = this.#correlated
    }

    metadata.fields = fields
    return metadata
  }
}
