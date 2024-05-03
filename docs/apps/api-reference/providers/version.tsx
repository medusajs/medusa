"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { Version } from "../types/openapi"
import { usePathname } from "next/navigation"
import { useIsBrowser } from "docs-ui"

type VersionContextType = {
  version: Version
  changeVersion: (value: Version) => void
}

const VersionContext = createContext<VersionContextType | null>(null)

type VersionProviderProps = {
  children: React.ReactNode
}

const VersionProvider = ({ children }: VersionProviderProps) => {
  const pathname = usePathname()
  const [version, setVersion] = useState<Version>("1")
  const isBrowser = useIsBrowser()

  const changeVersion = (version: Version) => {
    if (!isBrowser || process.env.NEXT_PUBLIC_VERSIONING !== "true") {
      return
    }
    localStorage.setItem("api-version", version)

    location.href = `${location.href.substring(
      0,
      location.href.indexOf(location.pathname)
    )}${pathname}`
  }

  useEffect(() => {
    if (!isBrowser || process.env.NEXT_PUBLIC_VERSIONING !== "true") {
      return
    }
    // try to load from localstorage
    const versionInLocalStorage = localStorage.getItem("api-version") as Version
    if (versionInLocalStorage) {
      setVersion(versionInLocalStorage)
    }
  }, [isBrowser])

  useEffect(() => {
    if (!isBrowser || process.env.NEXT_PUBLIC_VERSIONING !== "true") {
      return
    }
    const versionInLocalStorage = localStorage.getItem("api-version") as Version
    if (version !== versionInLocalStorage) {
      localStorage.setItem("api-version", version)
    }
  }, [version, isBrowser])

  return (
    <VersionContext.Provider value={{ version, changeVersion }}>
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
