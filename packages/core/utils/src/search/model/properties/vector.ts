import { SearchEmbedMarker, SearchPropertyMetadata } from "@medusajs/types"
import { BaseSearchProperty } from "./base"

// Extends the core base directly: a vector is matched by similarity, so
// filterable / sortable / facetable / array do not apply and are not offered.
export class VectorProperty extends BaseSearchProperty<number[]> {
  protected dataType: { name: "vector"; options?: Record<string, any> } = {
    name: "vector",
  }

  #dimensions: number
  #embed?: string

  constructor(dimensions: number) {
    super()
    this.#dimensions = dimensions
  }

  /**
   * Ask the engine to embed `source` into this field. Documents must not
   * include embeddings — pass the raw text on `source` instead. The engine
   * applies its configured embedding model.
   */
  embed(source: string): this & SearchEmbedMarker {
    this.#embed = source
    return this as this & SearchEmbedMarker
  }

  parse(fieldName: string): SearchPropertyMetadata<number[]> {
    const metadata = super.parse(fieldName)
    metadata.dimensions = this.#dimensions
    if (this.#embed) {
      metadata.embed = this.#embed
    }
    return metadata
  }
}
