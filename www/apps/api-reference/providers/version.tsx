"use client"

import { createContext, useContext, useMemo } from "react"
import { Version } from "../types/openapi"
import { usePathname } from "next/navigation"

type VersionContextType = {
  version: Version
  isVersioningEnabled: boolean
}

const VersionContext = createContext<VersionContextType | null>(null)

type VersionProviderProps = {
  children: React.ReactNode
}

const VersionProvider = ({ children }: VersionProviderProps) => {
  const pathname = usePathname()

  const version = useMemo(() => {
    return pathname.includes("v2") ? "2" : "1"
  }, [pathname])

  return (
    <VersionContext.Provider
      value={{
        version,
        isVersioningEnabled: process.env.NEXT_PUBLIC_VERSIONING === "true",
      }}
    >
      {children}
    </VersionContext.Provider>
  )
}

export default VersionProvider

export const useVersion = (): VersionContextType => {
  const context = useContext(VersionContext)

  if (!context) {
    throw new Error("useVersion must be used inside an VersionProvider")
  }

  return context
}
