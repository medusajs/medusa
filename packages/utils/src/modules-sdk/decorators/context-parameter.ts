export function MedusaContext() {
  return function (
    target: any,
    propertyKey: string | symbol,
    parameterIndex: number
  ) {
    target.MedusaContextIndex_ ??= {}
    target.MedusaContextIndex_[propertyKey] = parameterIndex
  }
}

MedusaContext.getIndex = function (
  target: any,
  propertyKey: string
): number | undefined {
  return target.MedusaContextIndex_?.[propertyKey]
}

export const MedusaContextType = "MedusaContext"
