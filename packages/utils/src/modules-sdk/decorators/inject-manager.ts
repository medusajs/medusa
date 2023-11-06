import { Context } from "@medusajs/types"

export function InjectManager(managerProperty?: string): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: any
  ): void {
    if (!target.MedusaContextIndex_) {
      throw new Error(
        `To apply @InjectManager you have to flag a parameter using @MedusaContext`
      )
    }

    const originalMethod = descriptor.value
    const argIndex = target.MedusaContextIndex_[propertyKey]

    descriptor.value = function (...args: any[]) {
      const context_: Context = {}

      // Copy the ref of all context props before assigning the transaction manager
      for (const key in args[argIndex]) {
        context_[key] = args[argIndex][key]
      }

      const resourceWithManager = !managerProperty
        ? this
        : this[managerProperty]

      context_.manager ??= resourceWithManager.getFreshManager()
      args[argIndex] = context_

      return originalMethod.apply(this, args)
    }
  }
}
