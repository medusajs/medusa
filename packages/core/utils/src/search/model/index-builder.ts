import { SearchSchema } from "@medusajs/types"
import { BooleanProperty } from "./properties/boolean"
import { DateProperty } from "./properties/date"
import { FloatProperty } from "./properties/float"
import { GeoProperty } from "./properties/geo"
import { IntegerProperty } from "./properties/integer"
import { KeywordProperty } from "./properties/keyword"
import { ObjectProperty } from "./properties/object"
import { TextProperty } from "./properties/text"
import { VectorProperty } from "./properties/vector"
import { SearchFieldsSchema } from "./search-fields-schema"

/**
 * Builder that exposes the search fields DSL — analogous to DML's EntityBuilder,
 * but only for index field schemas (registration stays on `defineSearchIndex`).
 */
export class SearchBuilder {
  /**
   * Define a search fields schema. Pass the result as `fields` to
   * `defineSearchIndex`. Does not register anything.
   *
   * @example
   * defineSearchIndex({
   *   name: "product",
   *   entity: "product",
   *   fields: search.define({
   *     id: search.keyword().filterable(),
   *     title: search.text().searchable({ weight: 3 }),
   *   }),
   *   async *seed() {},
   * })
   */
  define<Schema extends SearchSchema>(schema: Schema): SearchFieldsSchema<Schema> {
    return new SearchFieldsSchema(schema)
  }

  keyword() {
    return new KeywordProperty()
  }

  text() {
    return new TextProperty()
  }

  integer() {
    return new IntegerProperty()
  }

  float() {
    return new FloatProperty()
  }

  boolean() {
    return new BooleanProperty()
  }

  date() {
    return new DateProperty()
  }

  geo() {
    return new GeoProperty()
  }

  object<Schema extends SearchSchema>(schema: Schema) {
    return new ObjectProperty(schema)
  }

  vector(dimensions: number) {
    return new VectorProperty(dimensions)
  }
}

/**
 * Singleton used to define search index field schemas:
 *
 * ```ts
 * import { defineSearchIndex, search } from "@medusajs/framework/utils"
 *
 * defineSearchIndex({
 *   name: "product",
 *   entity: "product",
 *   fields: search.define({
 *     id: search.keyword().filterable(),
 *     title: search.text().searchable({ weight: 3 }),
 *   }),
 *   async *seed() {},
 * })
 * ```
 */
export const search = new SearchBuilder()
