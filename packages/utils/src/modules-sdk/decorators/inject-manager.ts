import { Context, SharedContext } from "@medusajs/types"

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
      const context: SharedContext | Context = { ...(args[argIndex] ?? {}) }
      const resourceWithManager = !managerProperty
        ? this
        : this[managerProperty]

      context.manager = context.manager ?? resourceWithManager.getFreshManager()
      args[argIndex] = context

      return originalMethod.apply(this, args)
    }
  }
}
