"use client"

import { createContext, useContext, useState } from "react"
import SearchModal from "../components/Search/Modal"

type SearchContextType = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  defaultFilters: string[]
  setDefaultFilters: (value: string[]) => void
}

const SearchContext = createContext<SearchContextType | null>(null)

type SearchProviderProps = {
  children: React.ReactNode
}

const SearchProvider = ({ children }: SearchProviderProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [defaultFilters, setDefaultFilters] = useState<string[]>([])

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
      <SearchModal />
    </SearchContext.Provider>
  )
}

export default SearchProvider

export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext)

  if (!context) {
    throw new Error("useSearch must be used inside a SearchProvider")
  }

  return context
}
