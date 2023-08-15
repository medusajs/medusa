"use client"

import { useEffect } from "react"

const useHeightObserver = () => {
  useEffect(() => {
    const storedHeight = window.localStorage.getItem("height")
    if (storedHeight) {
      document.body.style.height = storedHeight
    }

    const resizeObserver = new ResizeObserver((entries) => {
      window.localStorage.setItem(
        "height",
        `${entries[0].target.clientHeight}px`
      )
    })

    resizeObserver.observe(document.body)
  }, [])
}

export default useHeightObserver
