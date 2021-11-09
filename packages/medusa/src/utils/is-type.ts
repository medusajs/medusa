import {
  isString,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from "class-validator"
import { validator } from "./validator"

async function typeValidator(typedClass: any, plain: any): Promise<boolean> {
  switch (typedClass) {
    case String:
      return Promise.resolve(isString(plain))
    default:
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
          const results = await Promise.all(
            types.map(
              async (v) => await typeValidator(v, value).catch(() => false)
            )
          )
          return results.some(Boolean)
        },
        defaultMessage(validationArguments?: ValidationArguments) {
          const names = types.map((v) => v.name).join(", ")
          return `Type must be one of ${names}`
        },
      },
    })
  }
}
