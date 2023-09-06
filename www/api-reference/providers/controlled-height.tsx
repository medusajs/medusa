"use client"

import { createContext, useContext, useEffect, useState } from "react"

type ControlledHeightContextType = {
  height: number
}

const ControlledHeightContext =
  createContext<ControlledHeightContextType | null>(null)

type ControlledHeightProvider = {
  children?: React.ReactNode
}

const ControlledHeightProvider = ({ children }: ControlledHeightProvider) => {
  const [height, setHeight] = useState(0)

  const initHeight = () => {
    const storedHeight = window.localStorage.getItem("height")
    if (storedHeight) {
      setHeight(parseFloat(storedHeight))
    }

    const resizeObserver = new ResizeObserver((entries) => {
      window.localStorage.setItem(
        "height",
        `${entries[0].contentBoxSize[0].inlineSize}`
      )

      setHeight(entries[0].target.clientHeight)
    })

    resizeObserver.observe(document.body)
  }

  useEffect(() => {
    if (height !== document.body.clientHeight) {
      document.body.style.height = `${height}px`
    }
  }, [height])

  useEffect(() => {
    initHeight()
  }, [])

  return (
    <ControlledHeightContext.Provider
      value={{
        height,
      }}
    >
      {children}
    </ControlledHeightContext.Provider>
  )
}

export default ControlledHeightProvider

export const useControlledHeight = (): ControlledHeightContextType => {
  const context = useContext(ControlledHeightContext)

  if (!context) {
    throw new Error(
      "useControlledHeight must be used inside an ControlledHeightProvider"
    )
  }

  return context
}
