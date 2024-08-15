"use client"

import React, { useCallback, useEffect } from "react"
import { useIsBrowser } from "../.."

export type UseClickOutsideProps = {
  elmRef: React.RefObject<HTMLElement>
  onClickOutside: (e: MouseEvent) => void
}

export const useClickOutside = ({
  elmRef,
  onClickOutside,
}: UseClickOutsideProps) => {
  const isBrowser = useIsBrowser()

  const checkClickOutside = useCallback(
    (e: MouseEvent) => {
      if (!elmRef.current?.contains(e.target as Node)) {
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
