"use client"

import { createContext, useContext, useState } from "react"

type PageLoadingContextType = {
  isLoading: boolean
  setIsLoading: (value: boolean) => void
}

const PageLoadingContext = createContext<PageLoadingContextType | null>(null)

type PageLoadingProviderProps = {
  children?: React.ReactNode
}

const PageLoadingProvider = ({ children }: PageLoadingProviderProps) => {
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

export default PageLoadingProvider

export const usePageLoading = (): PageLoadingContextType => {
  const context = useContext(PageLoadingContext)

  if (!context) {
    throw new Error("usePageLoading must be used inside a PageLoadingProvider")
  }

  return context
}
