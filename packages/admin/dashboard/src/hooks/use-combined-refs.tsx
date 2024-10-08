import { MutableRefObject, Ref, RefCallback } from "react"

// Utility function to set multiple refs
function setRef<T>(ref: Ref<T> | undefined, value: T) {
  if (typeof ref === "function") {
    ref(value)
  } else if (ref && "current" in ref) {
    ;(ref as MutableRefObject<T>).current = value
  }
}

// Combining multiple refs into one
export const useCombinedRefs = <T,>(
  ...refs: (Ref<T> | undefined)[]
): RefCallback<T> => {
  return (value: T) => {
    refs.forEach((ref) => setRef(ref, value))
  }
}
