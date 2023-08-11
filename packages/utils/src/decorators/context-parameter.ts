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
