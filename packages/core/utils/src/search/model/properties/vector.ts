import { SearchPropertyMetadata } from "@medusajs/types"
import { BaseSearchProperty } from "./base"

// Extends the core base directly: a vector is matched by similarity, so
// filterable / sortable / facetable / array do not apply and are not offered.
// Hits omit the field unless `.retrievable()` is set — embeddings are not
// useful on results.
export class VectorProperty<T = number[]> extends BaseSearchProperty<T> {
  protected dataType: { name: "vector"; options?: Record<string, any> } = {
    name: "vector",
  }

  #dimensions: number
  #embed = false

  constructor(dimensions: number) {
    super()
    this.#dimensions = dimensions
  }

  /**
   * Ask the engine to embed this field's text at write time, and for
   * `search_options.vector.query` at query time. Documents pass a string on
   * this field; the engine applies its configured embedding model.
   */
  embed(): VectorProperty<string> {
    this.#embed = true
    return this as unknown as VectorProperty<string>
  }

  parse(fieldName: string): SearchPropertyMetadata<T> {
    const metadata = super.parse(fieldName)
    metadata.dimensions = this.#dimensions
    if (this.#embed) {
      metadata.embed = true
    }
    return metadata
  }
}
