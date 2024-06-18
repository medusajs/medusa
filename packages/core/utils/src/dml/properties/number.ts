import { BaseProperty } from "./base"

/**
 * The NumberProperty is used to define a numeric/integer
 * property
 */
export class NumberProperty extends BaseProperty<number> {
  protected dataType = {
    name: "number",
  } as const
}
