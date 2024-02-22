import { Context, SharedContext } from "@medusajs/types"
import { MedusaContextType } from "./context-parameter"

export function InjectSharedContext(): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: any
  ): void {
    if (!target.MedusaContextIndex_) {
      throw new Error(
        `To apply @InjectSharedContext you have to flag a parameter using @MedusaContext`
      )
    }

    const originalMethod = descriptor.value
    const argIndex = target.MedusaContextIndex_[propertyKey]

    descriptor.value = function (...args: any[]) {
      const context: SharedContext | Context = {
        ...(args[argIndex] ?? { __type: MedusaContextType }),
      }
      args[argIndex] = context

      return originalMethod.apply(this, args)
    }
  }
}
