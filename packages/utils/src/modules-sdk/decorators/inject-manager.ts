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
      const context: Context = args[argIndex] ?? {}
      const copiedContext = { ...context }

      const resourceWithManager = !managerProperty
        ? this
        : this[managerProperty]

      copiedContext.manager ??= resourceWithManager.getFreshManager()
      args[argIndex] = copiedContext

      const res = originalMethod.apply(this, args)

      for (const key in copiedContext) {
        if (key === "manager") continue
        context[key] = copiedContext[key]
      }
      args[argIndex] = context

      return res
    }
  }
}
