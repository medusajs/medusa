import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from "class-validator"
import { IOptions } from "class-validator-jsonschema/build/options"

export function IsNullable(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "IsNullable",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return value === null
        },
      },
    })
  }
}

export function IsNullableJSONSchemaConverter(
  _meta,
  _options: Partial<IOptions>
) {
  return { nullable: true }
}
