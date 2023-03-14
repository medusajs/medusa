import { SharedContext } from "@medusajs/types"
import { getArgumentNamesFromMethod } from "../get-argument-names"

export function InjectEntityManager(
  parameterName = "context",
  managerProperty = "manager_"
): MethodDecorator {
  return function (
    target: object,
    propertyKey: string | symbol,
    descriptor: any
  ): void {
    const originalMethod = descriptor.value

    const allArgs = getArgumentNamesFromMethod(originalMethod)
    if (allArgs[allArgs.length - 1] !== parameterName) {
      throw new Error(
        `To apply @InjectDbManager the last parameter name has to be ${parameterName}`
      )
    }

    descriptor.value = async function (...args: any[]) {
      const argPos = allArgs.length - 1
      const context: SharedContext =
        args.length === allArgs.length ? args[argPos] : {}

      if (context?.transactionManager) {
        return await originalMethod.apply(this, args)
      }

      return await this[managerProperty].transaction(
        async (transactionManager) => {
          args[argPos] = args[argPos] || {}
          args[argPos].transactionManager = transactionManager
          return await originalMethod.apply(this, args)
        }
      )
    }
  }
}
