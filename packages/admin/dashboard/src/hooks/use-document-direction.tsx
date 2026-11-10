import { useEffect, useState } from "react"

/**
 * Hook to get the current document direction (ltr/rtl) and listen for changes
 * @returns The current document direction as "ltr" | "rtl" | undefined
 */
export const useDocumentDirection = (): "ltr" | "rtl" | undefined => {
  const [direction, setDirection] = useState<"ltr" | "rtl" | undefined>(() => {
    // Initialize with current value
    if (typeof document !== "undefined") {
      return (
        (document.documentElement.getAttribute("dir") as "ltr" | "rtl") ||
        undefined
      )
    }
    return undefined
  })

  useEffect(() => {
    // Only run on client side
    if (typeof document === "undefined") {
      return
    }

    // Create a MutationObserver to watch for changes to the dir attribute
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "dir" &&
          mutation.target === document.documentElement
        ) {
          const newDirection = document.documentElement.getAttribute("dir") as
            "ltr" | "rtl"
          setDirection(newDirection || undefined)
        }
      })
    })

    // Start observing the document element for attribute changes
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["dir"],
    })

    // Cleanup observer on unmount
    return () => {
      observer.disconnect()
    }
  }, [])

  return direction
}
