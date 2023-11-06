import { Context } from "@medusajs/types"
import { isString } from "../../common"

export function InjectTransactionManager(
  shouldForceTransactionOrManagerProperty:
    | string
    | ((target: any) => boolean) = () => false,
  managerProperty?: string
): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: any
  ): void {
    if (!target.MedusaContextIndex_) {
      throw new Error(
        `To apply @InjectTransactionManager you have to flag a parameter using @MedusaContext`
      )
    }

    const originalMethod = descriptor.value
    const shouldForceTransaction = !isString(
      shouldForceTransactionOrManagerProperty
    )
      ? shouldForceTransactionOrManagerProperty
      : () => false
    managerProperty = isString(shouldForceTransactionOrManagerProperty)
      ? shouldForceTransactionOrManagerProperty
      : managerProperty

    const argIndex = target.MedusaContextIndex_[propertyKey]
    descriptor.value = async function (...args: any[]) {
      const shouldForceTransactionRes = shouldForceTransaction(target)
      const context: Context = args[argIndex] ?? {}
      const copiedContext = { ...context }

      if (!shouldForceTransactionRes && context?.transactionManager) {
        return await originalMethod.apply(this, args)
      }

      return await (!managerProperty
        ? this
        : this[managerProperty]
      ).transaction(
        async (transactionManager) => {
          copiedContext.transactionManager = transactionManager
          args[argIndex] = copiedContext

          const res = await originalMethod.apply(this, args)

          for (const key in copiedContext) {
            if (key === "transactionManager") continue
            context[key] = copiedContext[key]
          }
          args[argIndex] = context

          return res
        },
        {
          transaction: context?.transactionManager,
          isolationLevel: (context as Context)?.isolationLevel,
          enableNestedTransactions:
            (context as Context).enableNestedTransactions ?? false,
        }
      )
    }
  }
}
