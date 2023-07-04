import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator"

// returns true if it has xor relation with the specified key in the constraint
// stolen from: https://github.com/typestack/class-validator/issues/168#issuecomment-373944641
@ValidatorConstraint({ name: "xorConstraint", async: false })
export class XorConstraint implements ValidatorConstraintInterface {
  validate(propertyValue: string, args: ValidationArguments): boolean {
    return (
      (!!propertyValue && !args.object[args.constraints[0]]) ||
      (!propertyValue && !!args.object[args.constraints[0]])
    )
  }

  defaultMessage(args: ValidationArguments): string {
    return `Failed XOR relation between "${args.property}" and "${args.constraints[0]}".`
  }
}
