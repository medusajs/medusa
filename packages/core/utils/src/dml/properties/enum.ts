import { BaseProperty } from "./base"

type EnumLike = { [K: string]: string | number; [number: number]: string }

/**
 * The EnumProperty is used to define a property with pre-defined
 * list of choices.
 */
export class EnumProperty<
  const Values extends unknown[] | EnumLike
> extends BaseProperty<
  Values extends EnumLike ? Values[keyof Values] : Values[number]
> {
  protected dataType: {
    name: "enum"
    options: {
      choices: any[]
    }
  }

  constructor(values: Values) {
    super()
    if (Array.isArray(values)) {
      this.dataType = {
        name: "enum",
        options: { choices: values },
      }
    } else {
      this.dataType = {
        name: "enum",
        options: { choices: Object.values(values) },
      }
    }
  }
}
