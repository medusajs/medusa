import {
  isArray,
  isNumber,
  isString,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from "class-validator"
import { validator } from "./validator"

async function typeValidator(
  typedClass: any,
  plain: unknown
): Promise<boolean> {
  switch (typedClass) {
    case String:
      return isString(plain)
    case Number:
      return isNumber(Number(plain))
    default:
      if (isArray(typedClass) && isArray(plain)) {
        return (
          await Promise.all(
            (plain as any[]).map(
              async (p) =>
                await typeValidator(typedClass[0], p).catch(() => false)
            )
          )
        ).some(Boolean)
      }
      return (
        (await validator(typedClass, plain).then(() => true)) &&
        typeof plain === "object"
      )
  }
}

export function IsType(types: any[], validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string): void {
    registerDecorator({
      name: "IsType",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        async validate(value: unknown, args: ValidationArguments) {
          const results = await Promise.all(
            types.map(
              async (v) => await typeValidator(v, value).catch(() => false)
            )
          )
          return results.some(Boolean)
        },
        defaultMessage(validationArguments?: ValidationArguments) {
          const names = types.map(
            (t) => t.name || (isArray(t) ? `${t[0].name}[]` : "")
          )
          return `${validationArguments?.property} must be one of ${names
            .join(", ")
            .replace(/, ([^,]*)$/, " or $1")}`
        },
      },
    })
  }
}

class MyArray<T> extends Array<T> {
  private constructor(items: Array<T>) {
    super(...items)
  }

  static test<T>(): MyArray<T> {
    MyArray.name
    return Object.create(MyArray.prototype)
  }
}
