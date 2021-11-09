import { ClassConstructor, plainToClass } from "class-transformer"
import { validate, ValidationError } from "class-validator"
import { MedusaError } from "."

async function validator<T extends object, V>(
  typedClass: ClassConstructor<T>,
  plain: V
): Promise<T> {
  const toValidate = plainToClass(typedClass, plain, {
    ignoreDecorators: true,
    enableImplicitConversion: true,
  })

  console.log(toValidate)

  const errors = await validate(toValidate)

  const errorMessages = getErrorMessages(errors)
  // errors.reduce((acc: string[], next) => {
  //   if (next.constraints) {
  //     for (const [_, msg] of Object.entries(next.constraints)) {
  //       acc.push(msg)
  //     }
  //   }
  //   return acc
  // }, [])

  if (errors?.length) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      errorMessages.join(",")
    )
  }

  return toValidate
}

const getErrorMessages = (errors: ValidationError[]): string[] => {
  return errors.reduce((acc: string[], next) => {
    if (next.constraints) {
      for (const [_, msg] of Object.entries(next.constraints)) {
        acc.push(msg)
      }
    }
    if (next.children) {
      acc.push(...getErrorMessages(next.children))
    }
    return acc
  }, [])
}

export default validator
