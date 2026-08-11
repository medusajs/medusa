import {
  SearchArrayMarker,
  SearchFacetKind,
  SearchFieldKind,
  SearchPropertyMetadata,
  SearchPropertyType,
} from "@medusajs/types"
import { BaseSchemaProperty } from "../../../schema"

/**
 * The core of every search index field property. Only the modifiers that make
 * sense for any field kind live here; the narrower ones (searchable, facet
 * types, array, correlated) sit on the subclasses whose kinds support them, so
 * an invalid combination is a compile error instead of a boot failure.
 */
export abstract class BaseSearchProperty<T>
  extends BaseSchemaProperty<T>
  implements SearchPropertyType<T>
{
  protected abstract dataType: {
    name: SearchFieldKind
    options?: Record<string, any>
  }

  #retrievable?: boolean
  #providerOptions?: Record<string, Record<string, unknown>>

  retrievable(value: boolean = true) {
    this.#retrievable = value
    return this
  }

  providerOptions(options: Record<string, Record<string, unknown>>) {
    this.#providerOptions = options
    return this
  }

  parse(fieldName: string): SearchPropertyMetadata {
    const metadata: SearchPropertyMetadata = {
      ...super.parse(fieldName),
      dataType: this.dataType,
    }

    if (this.#retrievable !== undefined) {
      metadata.retrievable = this.#retrievable
    }
    if (this.#providerOptions !== undefined) {
      metadata.provider_options = this.#providerOptions
    }

    return metadata
  }
}

/**
 * A field holding plain values — every kind except vector. Can be filtered,
 * sorted, faceted on values, and hold arrays.
 */
export abstract class ScalarSearchProperty<T> extends BaseSearchProperty<T> {
  #filterable?: boolean
  #sortable?: boolean
  #facetable?: boolean | { types?: SearchFacetKind[] }
  #array?: boolean

  filterable(value: boolean = true) {
    this.#filterable = value
    return this
  }

  sortable(value: boolean = true) {
    this.#sortable = value
    return this
  }

  // Range / stats facets need an orderable kind, so the base only accepts a
  // boolean; RangeFacetSearchProperty widens the signature.
  facetable(value: boolean = true) {
    this.setFacetable(value)
    return this
  }

  protected setFacetable(value: boolean | { types?: SearchFacetKind[] }) {
    this.#facetable = value
  }

  // The SearchArrayMarker exists only in the type system; document inference
  // reads it to array the field's value type.
  array(): this & SearchArrayMarker {
    this.#array = true
    return this as this & SearchArrayMarker
  }

  parse(fieldName: string): SearchPropertyMetadata {
    const metadata = super.parse(fieldName)

    if (this.#filterable !== undefined) {
      metadata.filterable = this.#filterable
    }
    if (this.#sortable !== undefined) {
      metadata.sortable = this.#sortable
    }
    if (this.#facetable !== undefined) {
      metadata.facetable = this.#facetable
    }
    if (this.#array !== undefined) {
      metadata.array = this.#array
    }

    return metadata
  }
}

/**
 * text / keyword — the only kinds an engine can match as free text.
 */
export abstract class StringSearchProperty extends ScalarSearchProperty<string> {
  #searchable?: boolean | { weight?: number }

  searchable(value: boolean | { weight?: number } = true) {
    this.#searchable = value
    return this
  }

  parse(fieldName: string): SearchPropertyMetadata {
    const metadata = super.parse(fieldName)

    if (this.#searchable !== undefined) {
      metadata.searchable = this.#searchable
    }

    return metadata
  }
}

/**
 * integer / float / date — orderable kinds, so range and stats facets apply.
 */
export abstract class RangeFacetSearchProperty<
  T
> extends ScalarSearchProperty<T> {
  facetable(value: boolean | { types?: SearchFacetKind[] } = true) {
    this.setFacetable(value)
    return this
  }
}
