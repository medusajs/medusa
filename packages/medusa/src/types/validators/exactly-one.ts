import {
  isDefined,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator"

// Defines constraint that ensures exactly one of given properties
// It simply checks if any of the values provided is defined as
// a property on the class along side the property which is decorated
//
// Inspiration: https://github.com/typestack/class-validator/issues/245
@ValidatorConstraint({ async: false })
export class ExactlyOne implements ValidatorConstraintInterface {
  validate(propertyValue: string, args: ValidationArguments): boolean {
    if (isDefined(propertyValue)) {
      return this.getFailedConstraints(args).length === 0
    }
    return true
  }

  defaultMessage(args: ValidationArguments): string {
    return `Only one of ${args.property}, ${this.getFailedConstraints(
      args
    ).join(", ")} is allowed`
  }

  getFailedConstraints(args: ValidationArguments): boolean[] {
    return args.constraints.filter((prop) => isDefined(args.object[prop]))
  }
}
