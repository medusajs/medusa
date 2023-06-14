import { SharedContext } from "@medusajs/types"

export function InjectEntityManager(
  shouldForceTransaction: (target: any) => boolean = () => false,
  managerProperty: string = "manager_"
): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: any
  ): void {
    if (!target.MedusaContextIndex_) {
      throw new Error(
        `To apply @InjectEntityManager you have to flag a parameter using @MedusaContext`
      )
    }

    const originalMethod = descriptor.value

    const argIndex = target.MedusaContextIndex_[propertyKey]
    descriptor.value = async function (...args: any[]) {
      const shouldForceTransactionRes = shouldForceTransaction(target)
      const context: SharedContext = args[argIndex] ?? {}

      if (!shouldForceTransactionRes && context?.transactionManager) {
        return await originalMethod.apply(this, args)
      }

      return await this[managerProperty].transaction(
        async (transactionManager) => {
          args[argIndex] = args[argIndex] ?? {}
          args[argIndex].transactionManager = transactionManager

          return await originalMethod.apply(this, args)
        }
      )
    }
  }
}
