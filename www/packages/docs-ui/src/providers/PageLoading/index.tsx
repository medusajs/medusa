"use client"

import React, { createContext, useContext, useState } from "react"

export type PageLoadingContextType = {
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const PageLoadingContext = createContext<PageLoadingContextType | null>(null)

export type PageLoadingProviderProps = {
  children?: React.ReactNode
}

export const PageLoadingProvider = ({ children }: PageLoadingProviderProps) => {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <PageLoadingContext.Provider
      value={{
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </PageLoadingContext.Provider>
  )
}

export const usePageLoading = (): PageLoadingContextType => {
  const context = useContext(PageLoadingContext)

  if (!context) {
    throw new Error("usePageLoading must be used inside a PageLoadingProvider")
  }

  return context
}
