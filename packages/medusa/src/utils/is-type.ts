import {
  isArray,
  isNumber,
  isString,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from "class-validator"
import { MedusaError } from "medusa-core-utils"
import { validator } from "./validator"

async function typeValidator(
  typedClass: any,
  plain: unknown
): Promise<boolean> {
  switch (typedClass) {
    case String:
      if (!isString(plain)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `${plain} is not a string`
        )
      }
      return true
    case Number:
      if (!isNumber(Number(plain))) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `${plain} is not a number`
        )
      }
      return true
    default:
      if (isArray(typedClass) && isArray(plain)) {
        const errors: Map<any, string> = new Map()
        const result = (
          await Promise.all(
            (plain as any[]).map(
              async (p) =>
                await typeValidator(typedClass[0], p).catch((e) => {
                  errors.set(typedClass, e.message)
                  return false
                })
            )
          )
        ).some(Boolean)

        if (result) {
          return true
        }

        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `${Array.from(errors.entries()).map(
            (v) =>
              `${
                v[0].name || (isArray(v[0]) ? `${v[0][0].name}[]` : "undefined")
              }:[${v[1]}]`
          )}`
        )
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
          const errors: Map<any, string> = new Map()
          const results = await Promise.all(
            types.map(
              async (v) =>
                await typeValidator(v, value).catch((e) => {
                  errors.set(v, e.message)
                  return false
                })
            )
          )

          if (results.some(Boolean)) {
            return true
          }

          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `${Array.from(errors.entries()).map(
              (v) =>
                `${
                  v[0].name ||
                  (isArray(v[0]) ? `${v[0][0].name}[]` : "undefined")
                }:[${v[1]}]`
            )}`
          )
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
