"use client"

import React, { useCallback, useEffect } from "react"
import { useIsBrowser } from "../../providers/BrowserProvider"

export type UseClickOutsideProps = {
  elmRef: React.RefObject<HTMLElement | null>
  onClickOutside: (e: MouseEvent) => void
}

export const useClickOutside = ({
  elmRef,
  onClickOutside,
}: UseClickOutsideProps) => {
  const { isBrowser } = useIsBrowser()

  const checkClickOutside = useCallback(
    (e: MouseEvent) => {
      const node = e.target as Node
      if (!elmRef.current?.contains(node) && node.isConnected) {
        onClickOutside(e)
      }
    },
    [elmRef.current, onClickOutside]
  )

  useEffect(() => {
    if (!isBrowser) {
      return
    }

    window.document.addEventListener("click", checkClickOutside)

    return () => {
      window.document.removeEventListener("click", checkClickOutside)
    }
  }, [isBrowser, checkClickOutside])
}
