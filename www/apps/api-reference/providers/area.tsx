"use client"

import type { Area } from "@/types/openapi"
import { useSearch } from "docs-ui"
import { createContext, useContext, useEffect, useState } from "react"

type AreaContextType = {
  area: Area
  setArea: (value: Area) => void
}

const AreaContext = createContext<AreaContextType | null>(null)

type AreaProviderProps = {
  area: Area
  children: React.ReactNode
}

const AreaProvider = ({ area: passedArea, children }: AreaProviderProps) => {
  const [area, setArea] = useState<Area>(passedArea)
  const { defaultFilters, setDefaultFilters } = useSearch()

  useEffect(() => {
    if (!defaultFilters.includes(`${area}-v2`)) {
      setDefaultFilters([`${area}-v2`])
    }
  }, [area, defaultFilters, setDefaultFilters])

  return (
    <AreaContext.Provider
      value={{
        area,
        setArea,
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
