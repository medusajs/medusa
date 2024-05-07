"use client"

import { SearchProvider as UiSearchProvider, searchFiltersV2 } from "docs-ui"
import { config } from "../config"

type SearchProviderProps = {
  children: React.ReactNode
}

const SearchProvider = ({ children }: SearchProviderProps) => {
  return (
    <UiSearchProvider
      algolia={{
        appId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "temp",
        apiKey: process.env.NEXT_PUBLIC_ALGOLIA_API_KEY || "temp",
        mainIndexName:
          process.env.NEXT_PUBLIC_DOCS_ALGOLIA_INDEX_NAME || "temp",
        indices: [
          process.env.NEXT_PUBLIC_API_ALGOLIA_INDEX_NAME || "temp",
          process.env.NEXT_PUBLIC_DOCS_ALGOLIA_INDEX_NAME || "temp",
        ],
      }}
      searchProps={{
        isLoading: false,
        suggestions: [
          {
            title: "Search Suggestions",
            items: [
              "Medusa Configurations",
              "Commerce Modules",
              "Medusa JS Reference",
              "Medusa React Reference",
              "Workflows API Reference",
            ],
          },
        ],
        checkInternalPattern: new RegExp(`^${config.baseUrl}/v2/resources/.*`),
        filterOptions: searchFiltersV2,
      }}
      initialDefaultFilters={["resources"]}
    >
      {children}
    </UiSearchProvider>
  )
}

export default SearchProvider
