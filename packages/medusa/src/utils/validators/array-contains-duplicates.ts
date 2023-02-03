import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from "class-validator"
import { isDefined } from "medusa-core-utils"

export function containsDuplicates(value: any, property?: string): boolean {
  if (Array.isArray(value)) {
    let unique: string[] | Object[] = []
    if (isDefined(property)) {
      unique = [...new Set(value.map((v): Object => v[property]))]
    } else {
      unique = [...new Set(value)]
    }

    return unique.length === value.length
  }
  return false
}

export default function ContainsDuplicates(
  property: string,
  validationOptions?: ValidationOptions
): Function {
  return (object: Object, propertyName: string): void => {
    registerDecorator({
      name: "ContainsDuplicates",
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any) {
          return containsDuplicates(value, property)
        },
        defaultMessage(args: ValidationArguments): string {
          return `${args.property} contains duplicates`
        },
      },
    })
  }
}
