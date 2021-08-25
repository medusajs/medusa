import React from "react"
import { DocSearch } from "@docsearch/react"
import "../../medusa-plugin-themes/docsearch/theme.css"

const algoliaApiKey = process.env.ALGOLIA_APP_ID || "temp"

const Search = () => {
  return <DocSearch apiKey={algoliaApiKey} indexName="medusa-commerce" />
}

export default Search
