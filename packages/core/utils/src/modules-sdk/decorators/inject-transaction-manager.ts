import { Context } from "@medusajs/types"
import { MedusaContextType } from "./context-parameter"

export function InjectTransactionManager(
  managerProperty?: string
): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: any
  ): void {
    if (!target.MedusaContextIndex_) {
      throw new Error(
        `An error occurred applying decorator '@InjectTransactionManager' to method ${String(
          propertyKey
        )}: Missing parameter with flag @MedusaContext`
      )
    }

    const originalMethod = descriptor.value
    managerProperty ??= "baseRepository_"

    const argIndex = target.MedusaContextIndex_[propertyKey]
    descriptor.value = async function (...args: any[]) {
      const originalContext = args[argIndex] ?? {}

      if (originalContext?.transactionManager) {
        return await originalMethod.apply(this, args)
      }

      return await (!managerProperty
        ? this
        : this[managerProperty]
      ).transaction(
        async (transactionManager) => {
          const copiedContext = {} as Context
          for (const key in originalContext) {
            if (key === "transactionManager") {
              continue
            }

            Object.defineProperty(copiedContext, key, {
              enumerable: true,
              get: function () {
                return originalContext[key]
              },
              set: function (value) {
                originalContext[key] = value
              },
            })
          }

          copiedContext.transactionManager = transactionManager

          copiedContext.__type = MedusaContextType

          args[argIndex] = copiedContext

          return await originalMethod.apply(this, args)
        },
        {
          manager: originalContext?.manager,
          transaction: originalContext?.transactionManager,
          isolationLevel: (originalContext as Context)?.isolationLevel,
          enableNestedTransactions:
            (originalContext as Context).enableNestedTransactions ?? false,
        }
      )
    }
  }
}
