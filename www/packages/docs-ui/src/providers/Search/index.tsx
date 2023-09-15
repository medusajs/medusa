"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { SearchModal, SearchModalProps } from "@/components"
import { checkArraySameElms } from "../../utils"

export type SearchContextType = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  defaultFilters: string[]
  setDefaultFilters: (value: string[]) => void
}

const SearchContext = createContext<SearchContextType | null>(null)

export type SearchProviderProps = {
  children: React.ReactNode
  initialDefaultFilters?: string[]
  searchProps: SearchModalProps
}

export const SearchProvider = ({
  children,
  initialDefaultFilters = [],
  searchProps,
}: SearchProviderProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [defaultFilters, setDefaultFilters] = useState<string[]>(
    initialDefaultFilters
  )

  useEffect(() => {
    if (
      initialDefaultFilters.length &&
      !checkArraySameElms(defaultFilters, initialDefaultFilters)
    ) {
      setDefaultFilters(initialDefaultFilters)
    }
  }, [initialDefaultFilters])

  return (
    <SearchContext.Provider
      value={{
        isOpen,
        setIsOpen,
        defaultFilters,
        setDefaultFilters,
      }}
    >
      {children}
      <SearchModal {...searchProps} />
    </SearchContext.Provider>
  )
}

export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext)

  if (!context) {
    throw new Error("useSearch must be used inside a SearchProvider")
  }

  return context
}
