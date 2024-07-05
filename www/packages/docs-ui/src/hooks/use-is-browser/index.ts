"use client"

import { useEffect, useState } from "react"

export const useIsBrowser = () => {
  const [isBrowser, setIsBrowser] = useState(false)

  useEffect(() => {
    setIsBrowser(typeof window !== "undefined")
  }, [])

  return isBrowser
}
