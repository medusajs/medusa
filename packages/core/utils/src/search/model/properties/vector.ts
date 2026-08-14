import { SearchPropertyMetadata } from "@medusajs/types"
import { BaseSearchProperty } from "./base"

// Extends the core base directly: a vector is matched by similarity, so
// filterable / sortable / facetable / array do not apply and are not offered.
export class VectorProperty extends BaseSearchProperty<number[]> {
  protected dataType: { name: "vector"; options?: Record<string, any> } = {
    name: "vector",
  }

  #dimensions: number

  constructor(dimensions: number) {
    super()
    this.#dimensions = dimensions
  }

  parse(fieldName: string): SearchPropertyMetadata<number[]> {
    const metadata = super.parse(fieldName)
    metadata.dimensions = this.#dimensions
    return metadata
  }
}
