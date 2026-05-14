"use client"

import React from "react"
import type { OpenAPI } from "types"
import { capitalize, usePrevious, useSidebar } from "docs-ui"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { usePathname } from "next/navigation"

type AreaContextType = {
  area: OpenAPI.Area
  prevArea: OpenAPI.Area | undefined
  displayedArea: string
  setArea: (value: OpenAPI.Area) => void
}

const AreaContext = createContext<AreaContextType | null>(null)

type AreaProviderProps = {
  area: OpenAPI.Area
  children: React.ReactNode
}

const AreaProvider = ({ area: passedArea, children }: AreaProviderProps) => {
  const [area, setArea] = useState<OpenAPI.Area>(passedArea)
  const prevArea = usePrevious(area)
  const { setActivePath } = useSidebar()
  const pathname = usePathname()

  const displayedArea = useMemo(() => {
    return capitalize(area)
  }, [area])

  useEffect(() => {
    setActivePath(null)
  }, [pathname])

  return (
    <AreaContext.Provider
      value={{
        area,
        prevArea,
        setArea,
        displayedArea,
      }}
    >
      {children}
    </AreaContext.Provider>
  )
}

export default AreaProvider

export const useArea = (): AreaContextType => {
  const context = useContext(AreaContext)

  if (!context) {
    throw new Error("useAreaProvider must be used inside an AreaProvider")
  }

  return context
}
