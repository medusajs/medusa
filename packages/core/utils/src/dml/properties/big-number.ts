import { BaseProperty } from "./base"

/**
 * The NumberProperty is used to define a numeric/integer
 * property
 */
export class BigNumberProperty extends BaseProperty<number> {
  protected dataType = {
    name: "bigNumber",
  } as const

  static isBigNumberProperty(obj: any): obj is BigNumberProperty {
    return !!obj && obj.dataType.name === "bigNumber"
  }
}
