"use client"

import React, { useContext, useEffect, useState } from "react"

type BrowserContextType = {
  isBrowser: boolean
}

const BrowserContext = React.createContext<BrowserContextType | null>(null)

type BrowserProviderProps = {
  children: React.ReactNode
}

export const BrowserProvider = ({ children }: BrowserProviderProps) => {
  const [isBrowser, setIsBrowser] = useState(false)

  useEffect(() => {
    setIsBrowser(typeof window !== "undefined")
  }, [])

  return (
    <BrowserContext.Provider
      value={{
        isBrowser,
      }}
    >
      {children}
    </BrowserContext.Provider>
  )
}

export const useIsBrowser = () => {
  const context = useContext(BrowserContext)

  if (!context) {
    throw new Error("useIsBrowser must be used within a BrowserProvider")
  }

  return context
}
