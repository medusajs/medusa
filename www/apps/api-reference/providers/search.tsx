"use client"

import {
  usePageLoading,
  SearchProvider as UiSearchProvider,
  searchFiltersV2,
} from "docs-ui"
import { config } from "../config"
import basePathUrl from "../utils/base-path-url"

type SearchProviderProps = {
  children: React.ReactNode
}

const SearchProvider = ({ children }: SearchProviderProps) => {
  const { isLoading } = usePageLoading()
  return (
    <UiSearchProvider
      algolia={{
        appId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "temp",
        apiKey: process.env.NEXT_PUBLIC_ALGOLIA_API_KEY || "temp",
        mainIndexName: process.env.NEXT_PUBLIC_API_ALGOLIA_INDEX_NAME || "temp",
        indices: [
          process.env.NEXT_PUBLIC_API_ALGOLIA_INDEX_NAME || "temp",
          process.env.NEXT_PUBLIC_DOCS_ALGOLIA_INDEX_NAME || "temp",
        ],
      }}
      searchProps={{
        isLoading,
        suggestions: [
          {
            title: "Getting started? Try one of the following terms.",
            items: [
              "Install Medusa with create-medusa-app",
              "What is an API route?",
              "What is a Module?",
              "What is a Workflow?",
            ],
          },
          {
            title: "Developing with Medusa",
            items: [
              "How to create a Module",
              "How to create an API route",
              "How to create a data model",
              "How to create an admin widget",
            ],
          },
        ],
        checkInternalPattern: new RegExp(
          `^${config.baseUrl}${basePathUrl(`/(admin|store)`)}`
        ),
        filterOptions: searchFiltersV2,
      }}
    >
      {children}
    </UiSearchProvider>
  )
}

export default SearchProvider
