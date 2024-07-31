"use client"

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"

export type MobileContextType = {
  isMobile?: boolean
}

const MobileContext = createContext<MobileContextType | null>(null)

export type MobileProviderProps = {
  children: React.ReactNode
}

export const MobileProvider = ({ children }: MobileProviderProps) => {
  const [isMobile, setIsMobile] = useState(false)

  const handleResize = useCallback(() => {
    if (window.innerWidth < 1024 && !isMobile) {
      setIsMobile(true)
    } else if (window.innerWidth >= 1024 && isMobile) {
      setIsMobile(false)
    }
  }, [isMobile])

  useEffect(() => {
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [handleResize])

  useEffect(() => {
    handleResize()
  }, [])

  return (
    <MobileContext.Provider
      value={{
        isMobile,
      }}
    >
      {children}
    </MobileContext.Provider>
  )
}

export const useMobile = () => {
  const context = useContext(MobileContext)

  if (!context) {
    throw new Error("useMobile must be used within a MobileProvider")
  }

  return context
}
