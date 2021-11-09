import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  Validator,
} from "class-validator"

const typeValidator = {
  string: function (value: any, args: ValidationArguments): boolean {
    const validator = new Validator()
    return validator.isString(value)
  },
  int: function (value: any, args: ValidationArguments): boolean {
    const validator = new Validator()
    return validator.isInt(value)
  },
  // Add more here
}

export function IsType(
  types: (keyof typeof typeValidator)[],
  validationOptions?: ValidationOptions
) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      name: "wrongType",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: object, args: ValidationArguments) {
          return types.some((v) => typeValidator[v](value, args))
        },
        defaultMessage() {
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
