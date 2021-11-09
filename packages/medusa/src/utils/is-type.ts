import {
  isInt,
  isString,
  registerDecorator,
  validate,
  ValidationArguments,
  ValidationOptions,
} from "class-validator"
import { AddressPayload } from "../api/routes/store/customers/update-customer"

const typeValidator = {
  string: function (value: unknown, args: ValidationArguments) {
    return isString(value)
  },
  int: function (value: unknown, args: ValidationArguments) {
    return isInt(value)
  },
  address: async function (value: any, args: ValidationArguments) {
    return validate(AddressPayload, value)
  },
  // Add more here
}

export function IsType(
  types: (keyof typeof typeValidator)[],
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "IsType",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          return types.some((v) => typeValidator[v](value, args))
        },
        defaultMessage(validationArguments?: ValidationArguments) {
          const lastType = types.pop()
          if (types.length == 0) {
            return `Has to be ${lastType}`
          }
          return `Can only be ${types.join(", ")} or ${lastType}.`
        },
      },
    })
  }
}
