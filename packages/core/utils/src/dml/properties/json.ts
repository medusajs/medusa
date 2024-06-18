import { PropertyMetadata } from "../types"
import { BaseProperty } from "./base"

/**
 * The JSONProperty is used to define a property that stores
 * data as a JSON string
 */
export class JSONProperty extends BaseProperty<string> {
  protected dataType = {
    name: "json",
  } as const
}
