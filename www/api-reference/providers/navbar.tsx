"use client"

import type { Area } from "@/types/openapi"
import { createContext, useContext, useState } from "react"

type NavbarContextType = {
  activeItem: Area | null
  setActiveItem: (value: Area) => void
}

const NavbarContext = createContext<NavbarContextType | null>(null)

type NavbarProviderProps = {
  children: React.ReactNode
}

const NavbarProvider = ({ children }: NavbarProviderProps) => {
  const [activeItem, setActiveItem] = useState<Area | null>(null)

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

export default NavbarProvider

export const useNavbar = (): NavbarContextType => {
  const context = useContext(NavbarContext)

  if (!context) {
    throw new Error("useNavbar must be used inside a NavbarProvider")
  }

  return context
}
