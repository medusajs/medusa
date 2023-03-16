export function MedusaContext() {
  return function (
    target: any,
    propertyKey: string | symbol,
    parameterIndex: number
  ) {
    if (!target.MedusaContext_) {
      target.MedusaContext_ = {}
    }

    if (propertyKey in target.MedusaContext_) {
      throw new Error(
        `Only one MedusaContext is allowed on method "${String(propertyKey)}".`
      )
    }

    target.MedusaContext_[propertyKey] = parameterIndex
  }
}
