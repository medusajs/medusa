"use client"

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react"
import { SearchModal, SearchModalProps } from "@/components"
import { checkArraySameElms } from "../../utils"
import algoliasearch, { SearchClient } from "algoliasearch/lite"

export type SearchContextType = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  defaultFilters: string[]
  setDefaultFilters: (value: string[]) => void
  searchClient: SearchClient
}

const SearchContext = createContext<SearchContextType | null>(null)

export type AlgoliaProps = {
  appId: string
  apiKey: string
  mainIndexName: string
  indices: string[]
}

export type SearchProviderProps = {
  children: React.ReactNode
  initialDefaultFilters?: string[]
  algolia: AlgoliaProps
  searchProps: Omit<SearchModalProps, "algolia">
}

export const SearchProvider = ({
  children,
  initialDefaultFilters = [],
  searchProps,
  algolia,
}: SearchProviderProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [defaultFilters, setDefaultFilters] = useState<string[]>(
    initialDefaultFilters
  )

  const searchClient: SearchClient = useMemo(() => {
    const algoliaClient = algoliasearch(algolia.appId, algolia.apiKey)
    return {
      ...algoliaClient,
      async search(requests) {
        if (requests.every(({ params }) => !params?.query)) {
          return Promise.resolve({
            results: requests.map(() => ({
              hits: [],
              nbHits: 0,
              nbPages: 0,
              page: 0,
              processingTimeMS: 0,
              hitsPerPage: 0,
              exhaustiveNbHits: false,
              query: "",
              params: "",
            })),
          })
        }

        return algoliaClient.search(requests)
      },
    }
  }, [algolia.appId, algolia.apiKey])

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
        searchClient,
      }}
    >
      {children}
      <SearchModal {...searchProps} algolia={algolia} />
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
