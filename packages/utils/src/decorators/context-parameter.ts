export function MedusaContext() {
  return function (
    target: any,
    propertyKey: string | symbol,
    parameterIndex: number
  ) {
    if (!target.MedusaContextIndex_) {
      target.MedusaContextIndex_ = {}
    }

    if (propertyKey in target.MedusaContextIndex_) {
      throw new Error(
        `Only one MedusaContext is allowed on method "${String(propertyKey)}".`
      )
    }

    target.MedusaContextIndex_[propertyKey] = parameterIndex
  }
}
