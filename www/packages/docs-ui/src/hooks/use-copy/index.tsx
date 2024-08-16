"use client"

import { useCallback, useEffect, useRef, useState } from "react"

type useCopyReturnType = {
  isCopied: boolean
  handleCopy: () => void
}

export const useCopy = (text: string): useCopyReturnType => {
  const [isCopied, setIsCopied] = useState(false)
  const copyTimeout = useRef<number>(0)

  const handleCopy = useCallback(() => {
    navigator.clipboard
      .writeText(text.trim())
      .then(() => {
        setIsCopied(true)
        copyTimeout.current = window.setTimeout(() => {
          setIsCopied(false)
        }, 1000)
      })
      .catch(console.error)
  }, [text])

  useEffect(() => () => window.clearTimeout(copyTimeout.current), [])

  return { isCopied, handleCopy }
}
