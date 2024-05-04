"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import copy from "copy-text-to-clipboard"

type useCopyReturnType = {
  isCopied: boolean
  handleCopy: () => void
}

export const useCopy = (text: string): useCopyReturnType => {
  const [isCopied, setIsCopied] = useState(false)
  const copyTimeout = useRef<number>(0)

  const handleCopy = useCallback(() => {
    copy(text)
    setIsCopied(true)
    copyTimeout.current = window.setTimeout(() => {
      setIsCopied(false)
    }, 1000)
  }, [text])

  useEffect(() => () => window.clearTimeout(copyTimeout.current), [])

  return { isCopied, handleCopy }
}
