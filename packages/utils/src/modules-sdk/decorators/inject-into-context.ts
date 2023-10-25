import { Context } from "@medusajs/types"

export function InjectIntoContext(
  properties: Record<string, unknown | Function>
): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: any
  ): void {
    if (!target.MedusaContextIndex_) {
      throw new Error(
        `To apply @InjectIntoContext you have to flag a parameter using @MedusaContext`
      )
    }

    const argIndex = target.MedusaContextIndex_[propertyKey]
    const original = descriptor.value
    descriptor.value = async function (...args: any[]) {
      const context: Context = args[argIndex] ?? {}

      for (const key of Object.keys(properties)) {
        args[argIndex] = args[argIndex] ?? {}
        args[argIndex][key] =
          typeof properties[key] === "function"
            ? (properties[key] as Function)(context)
            : properties[key]
      }

      return await original.apply(this, args)
    }
  }
}
