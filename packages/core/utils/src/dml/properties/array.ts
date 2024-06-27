import { BaseProperty } from "./base"

/**
 * The ArrayProperty is used to define an array property
 */
export class ArrayProperty extends BaseProperty<string[]> {
  protected dataType = {
    name: "array",
  } as const
}
