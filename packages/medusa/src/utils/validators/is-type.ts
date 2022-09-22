import {
  isArray,
  isNumber,
  isString,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from "class-validator"
import { isDate } from "lodash"
import { MedusaError } from "medusa-core-utils"
import { validator } from "../validator"

async function typeValidator(
  typedClass: any,
  plain: unknown
): Promise<boolean> {
  switch (typedClass) {
    case String:
      if (!isString(plain)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `String validation failed: ${plain} is not a string`
        )
      }
      return true
    case Number:
      if (!isNumber(Number(plain))) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Number validation failed: ${plain} is not a number`
        )
      }
      return true
    case Date:
      if (!isDate(new Date(plain as string))) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Date validation failed: ${plain} is not a date`
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
                  errors.set(typedClass[0].name, e.message.split(","))
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
          Object.fromEntries(errors.entries())
        )
      }
      return (
        (await validator(typedClass, plain).then(() => true)) &&
        typeof plain === "object"
      )
  }
}

export function IsType(types: any[], validationOptions?: ValidationOptions) {
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
                  errors.set(v.name, e.message.split(",").filter(Boolean))
                  return false
                })
            )
          )

          if (results.some(Boolean)) {
            return true
          }

          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            JSON.stringify({
              message: `${args.property} must be one of: ${types.map(
                (t) => `${t.name || (Array.isArray(t) ? t[0]?.name : "")}`
              )}`,
              details: Object.fromEntries(errors.entries()),
            })
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
