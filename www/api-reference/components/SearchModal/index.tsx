"use client"

import React from "react"
import algoliasearch from "algoliasearch/lite"
import {
  InstantSearch,
  Hits,
  Highlight,
  Snippet,
  SearchBox,
} from "react-instantsearch"
import Modal from "../Modal"
import clsx from "clsx"
import IconMagnifyingGlass from "../Icons/MagnifyingGlass"

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "temp",
  process.env.NEXT_PUBLIC_ALGOLIA_API_KEY || "temp"
)

const SearchModal = () => {
  return (
    <Modal contentClassName={"!p-0"}>
      <InstantSearch
        indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME}
        searchClient={searchClient}
      >
        <SearchBox
          classNames={{
            root: clsx(
              "h-[56px] w-full rounded-t relative border-b border-medusa-border-base dark:border-medusa-border-base-dark"
            ),
            form: clsx("h-full rounded-t"),
            input: clsx(
              "w-full h-full pl-[60px] text-medusa-fg-subtle dark:text-medusa-fg-subtle-dark",
              "placeholder:text-medusa-fg-muted dark:placeholder:text-medusa-fg-muted-dark",
              "rounded-t text-medium"
            ),
            submit: clsx("absolute top-[18px] left-1.5"),
            reset: clsx("absolute top-[18px] left-1.5"),
            loadingIndicator: clsx("hidden"),
          }}
          submitIconComponent={() => (
            <IconMagnifyingGlass iconColorClassName="stroke-medusa-fg-muted dark:stroke-medusa-fg-muted-dark" />
          )}
          placeholder="Find something..."
        />
        <Hits
          hitComponent={({ hit }) => (
            <article>
              <h1>
                <Highlight attribute="name" hit={hit} />
              </h1>
              <Snippet hit={hit} attribute="description" />
            </article>
          )}
        />
      </InstantSearch>
    </Modal>
  )
}

export default SearchModal
