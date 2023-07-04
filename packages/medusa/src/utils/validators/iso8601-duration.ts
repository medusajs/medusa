import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from "class-validator"

export function IsISO8601Duration(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string): void {
    registerDecorator({
      name: "IsGreaterThan",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const isoDurationRegex =
            /^P(?!$)(\d+Y)?(\d+M)?(\d+W)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?$/
          return isoDurationRegex.test(value)
        },
        defaultMessage(args?: ValidationArguments): string {
          return `"${propertyName}" must be a valid ISO 8601 duration`
        },
      },
    })
  }
}
