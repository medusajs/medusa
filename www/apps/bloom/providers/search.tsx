"use client"

import { SearchProvider as UiSearchProvider } from "docs-ui"
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
      }}
      indices={[
        {
          value: process.env.NEXT_PUBLIC_DOCS_ALGOLIA_INDEX_NAME || "temp",
          title: "Bloom",
        },
      ]}
      defaultIndex={process.env.NEXT_PUBLIC_DOCS_ALGOLIA_INDEX_NAME || "temp"}
      searchProps={{
        isLoading: false,
        suggestions: [
          {
            title: "Search Suggestions",
            items: [
              "Getting Started",
              "Agent Features",
              "Commerce Features",
              "Integrate Services",
              "Publish Store",
            ],
          },
        ],
        checkInternalPattern: new RegExp(
          `^${config.baseUrl}/${config.basePath}`
        ),
      }}
    >
      {children}
    </UiSearchProvider>
  )
}

export default SearchProvider
