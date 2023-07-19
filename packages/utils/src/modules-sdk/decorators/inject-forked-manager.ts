import { Context, SharedContext } from "@medusajs/types"

export function InjectForkedManager(
  managerProperty?: string
): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: any
  ): void {
    if (!target.MedusaContextIndex_) {
      throw new Error(
        `To apply @InjectForkedManager you have to flag a parameter using @MedusaContext`
      )
    }

    const originalMethod = descriptor.value
    const argIndex = target.MedusaContextIndex_[propertyKey]

    descriptor.value = async function (...args: any[]) {
      const context: SharedContext | Context = args[argIndex] ?? {}
      const resourceWithManager = await (!managerProperty ? this : this[managerProperty])

      context.forkedManager = context.forkedManager ?? await resourceWithManager.manager_.fork()
      args[argIndex] = context

      return originalMethod.apply(this, args)
    }
  }
}
