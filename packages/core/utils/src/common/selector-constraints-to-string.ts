export function selectorConstraintsToString(
  selector: object | object[]
): string {
  const selectors = Array.isArray(selector) ? selector : [selector]

  return selectors
    .map((selector_) => {
      return Object.entries(selector_)
        .map(
          ([key, value]: [string, any]) =>
            `${key}: ${value._type ? `${value._type}(${value._value})` : value}`
        )
        .join(", ")
    })
    .join(" or ")
}
