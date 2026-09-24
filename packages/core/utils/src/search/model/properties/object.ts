import { InferSearchObjectValue, SearchPropertyMetadata, SearchSchema } from "@medusajs/types"
import { ScalarSearchProperty } from "./base"

export class ObjectProperty<
  Schema extends SearchSchema
> extends ScalarSearchProperty<InferSearchObjectValue<Schema>> {
  protected dataType: { name: "object"; options?: Record<string, any> } = {
    name: "object",
  }

  #fields: Schema

  constructor(fields: Schema) {
    super()
    this.#fields = fields
  }

  parse(fieldName: string): SearchPropertyMetadata<InferSearchObjectValue<Schema>> {
    const metadata = super.parse(fieldName)
    const fields: Record<string, SearchPropertyMetadata> = {}

    for (const [name, property] of Object.entries(this.#fields)) {
      fields[name] = property.parse(name)
    }

    metadata.fields = fields
    return metadata
  }
}
