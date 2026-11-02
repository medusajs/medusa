/** Checks whether the given value is an object with `name`, `message`, and `stack` properties. */
export function isErrorLike(value) {
  return (
    !!value &&
    typeof value === "object" &&
    "name" in value &&
    "message" in value &&
    "stack" in value
  )
}
