"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { usePathname } from "next/navigation"

export type NavbarContextType = {
  activeItem: string | null
  setActiveItem: (value: string) => void
}

const NavbarContext = createContext<NavbarContextType | null>(null)

export type NavbarProviderProps = {
  children: React.ReactNode
  basePath?: string
}

export const NavbarProvider = ({
  children,
  basePath = "",
}: NavbarProviderProps) => {
  const [activeItem, setActiveItem] = useState<string | null>(null)
  const pathname = usePathname()

  const assemblePathName = (path: string) =>
    `${basePath}/${path.charAt(0) === "/" ? path.substring(1) : path}`

  useEffect(() => {
    const newPath = assemblePathName(pathname)
    if (activeItem !== newPath) {
      setActiveItem(newPath)
    }
  }, [pathname, activeItem])

  return (
    <NavbarContext.Provider
      value={{
        activeItem,
        setActiveItem,
      }}
    >
      {children}
    </NavbarContext.Provider>
  )
}

export const useNavbar = (): NavbarContextType => {
  const context = useContext(NavbarContext)

  if (!context) {
    throw new Error("useNavbar must be used inside a NavbarProvider")
  }

  return context
}
