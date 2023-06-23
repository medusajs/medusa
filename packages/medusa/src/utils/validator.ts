import { ClassConstructor, plainToInstance } from "class-transformer"
import { validate, ValidationError, ValidatorOptions } from "class-validator"
import { MedusaError } from "medusa-core-utils"
import { Constructor } from "@medusajs/types"

const extendedValidators: Map<string, Constructor<any>> = new Map()

/**
 * When overriding a validator, you can register it to be used instead of the original one.
 * For example, the place where you are overriding the core validator, you can call this function
 * @example
 * ```ts
 * // /src/api/routes/admin/products/create-product.ts
 * import { registerOverriddenValidators } from "@medusajs/medusa"
 * import { AdminPostProductsReq as MedusaAdminPostProductsReq } from "@medusajs/medusa/dist/api/routes/admin/products/create-product"
 * import { IsString } from "class-validator"
 *
 * class AdminPostProductsReq extends MedusaAdminPostProductsReq {
 *    @IsString()
 *    test: string
 * }
 *
 * registerOverriddenValidators(AdminPostProductsReq)
 * ```
 * @param extendedValidator
 */
export function registerOverriddenValidators(
  extendedValidator: Constructor<any>
): void {
  extendedValidators.set(extendedValidator.name, extendedValidator)
}

const reduceErrorMessages = (errs: ValidationError[]): string[] => {
  return errs.reduce((acc: string[], next) => {
    if (next.constraints) {
      for (const [_, msg] of Object.entries(next.constraints)) {
        acc.push(msg)
      }
    }

    if (next.children) {
      acc.push(...reduceErrorMessages(next.children))
    }
    return acc
  }, [])
}

export async function validator<T, V>(
  typedClass: ClassConstructor<T>,
  plain: V,
  config: ValidatorOptions = {}
): Promise<T> {
  typedClass = extendedValidators.get(typedClass.name) ?? typedClass

  const toValidate = plainToInstance(typedClass, plain)
  // @ts-ignore
  const errors = await validate(toValidate, {
    whitelist: true,
    forbidNonWhitelisted: true,
    ...config,
  })

  const errorMessages = reduceErrorMessages(errors)

  if (errors?.length) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      errorMessages.join(", ")
    )
  }

  return toValidate
}
