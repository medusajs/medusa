import { BaseProperty } from "./base"

/**
 * The JSONProperty is used to define a property that stores
 * data as a JSON string.
 *
 * The stored data-type defaults to a JSON object, but any
 * JSON-serializable type can be passed instead, such as an array.
 */
export class JSONProperty<T = Record<string, unknown>> extends BaseProperty<T> {
  protected dataType = {
    name: "json",
  } as const
}
