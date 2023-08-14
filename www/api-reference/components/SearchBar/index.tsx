"use client"

import { DocSearch } from "@docsearch/react"

import "@docsearch/css"

const SearchBar = () => {
  return (
    <DocSearch
      appId={process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "temp"}
      indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || "temp"}
      apiKey={process.env.NEXT_PUBLIC_ALGOLIA_API_KEY || "temp"}
      searchParameters={{
        tagFilters: ["api"],
      }}
    />
  )
}

export default SearchBar
