import React from "react"
import { DocSearch } from "@docsearch/react"
import "../../medusa-plugin-themes/docsearch/theme.css"

const algoliaApiKey =
  process.env.ALGOLIA_API_KEY || "25626fae796133dc1e734c6bcaaeac3c" //second opt is for testing purposes
const algoliaIndexName = process.env.ALGOLIA_API_KEY || "docsearch"

const Search = () => {
  return <DocSearch apiKey={algoliaApiKey} indexName={algoliaIndexName} />
}

export default Search
