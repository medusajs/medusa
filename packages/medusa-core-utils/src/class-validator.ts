import { ClassConstructor, plainToClass } from "class-transformer"
import { validate } from "class-validator"
import { MedusaError } from "."

async function validator<T extends object, V>(
  typedClass: ClassConstructor<T>,
  plain: V
): Promise<T> {
  const toValidate = plainToClass(typedClass, plain)

  const errors = await validate(toValidate)

  const errorMessages = errors.reduce((acc: string[], next) => {
    if (next.constraints) {
        for (const [_, msg] of Object.entries(next.constraints)) {
          acc.push(msg)
        }
    }
    return acc
  }, [])

  if (errors?.length) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      errorMessages.join(",")
    )
  }

  return toValidate
}

export default validator
