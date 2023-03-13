import { useLayoutEffect, useRef } from "react"
import { useWindowDimensions } from "./use-window-dimensions"

export const useComputedHeight = (bottomPad: number) => {
  const ref = useRef(null)
  const heightRef = useRef(0)

  const { height } = useWindowDimensions()

  useLayoutEffect(() => {
    if (ref.current) {
      const { top } = ref.current.getBoundingClientRect()
      // take the inner height of the window, subtract 32 from it (for the bottom padding), then subtract that from the top position of our grid row (wherever that is)
      heightRef.current = height - bottomPad - top
    }
  }, [bottomPad, height])

  return { ref, height: heightRef.current }
}
