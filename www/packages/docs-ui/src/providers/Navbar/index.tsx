"use client"

import React, { createContext, useContext, useState } from "react"

export type NavbarContextType = {
  activeItem: string | null
  setActiveItem: (value: string) => void
}

const NavbarContext = createContext<NavbarContextType | null>(null)

export type NavbarProviderProps = {
  children: React.ReactNode
}

export const NavbarProvider = ({ children }: NavbarProviderProps) => {
  const [activeItem, setActiveItem] = useState<string | null>(null)

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
