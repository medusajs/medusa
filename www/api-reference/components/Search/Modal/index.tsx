"use client"

import React, { useEffect, useMemo, useState } from "react"
import algoliasearch, { SearchClient } from "algoliasearch/lite"
import { InstantSearch, SearchBox, Configure } from "react-instantsearch"
import Modal from "../../Modal"
import clsx from "clsx"
import IconMagnifyingGlass from "../../Icons/MagnifyingGlass"
import Select, { OptionType } from "../../Select"
import IconXMark from "../../Icons/XMark"
import SearchEmptyQueryBoundary from "../EmptyQueryBoundary"
import SearchSuggestions from "../Suggestions"
import { useSearch } from "../../../providers/search"
import checkArraySameElms from "../../../utils/array-same-elms"
import SearchHitsWrapper from "../Hits"
import Button from "../../Button"

const algoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "temp",
  process.env.NEXT_PUBLIC_ALGOLIA_API_KEY || "temp"
)

const searchClient: SearchClient = {
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

const SearchModal = () => {
  const options: OptionType[] = useMemo(() => {
    return [
      {
        value: "admin",
        label: "Admin API",
      },
      {
        value: "store",
        label: "Store API",
      },
      {
        value: "docs",
        label: "Docs",
      },
      {
        value: "user-guide",
        label: "User Guide",
      },
      {
        value: "plugins",
        label: "Plugins",
      },
      {
        value: "reference",
        label: "References",
      },
      {
        value: "ui",
        label: "UI",
      },
    ]
  }, [])
  const { isOpen, setIsOpen, defaultFilters } = useSearch()
  const [filters, setFilters] = useState<string[]>(defaultFilters)
  const formattedFilters: string = useMemo(() => {
    let formatted = ""
    filters.forEach((filter) => {
      const split = filter.split("_")
      split.forEach((f) => {
        if (formatted.length) {
          formatted += " OR "
        }
        formatted += `_tags:${f}`
      })
    })
    return formatted
  }, [filters])

  useEffect(() => {
    if (!checkArraySameElms(defaultFilters, filters)) {
      setFilters(defaultFilters)
    }
  }, [defaultFilters])

  return (
    <Modal
      contentClassName={clsx(
        "!p-0 overflow-hidden relative h-full md:h-[400px] lg:max-h-[400px] lg:min-h-[400px]"
      )}
      modalContainerClassName="w-screen h-screen"
      open={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <InstantSearch
        indexName={process.env.NEXT_PUBLIC_API_ALGOLIA_INDEX_NAME}
        searchClient={searchClient}
      >
        <div className="flex">
          <Select
            multiple
            options={options}
            value={filters}
            setSelected={(value) =>
              setFilters(Array.isArray(value) ? [...value] : [value])
            }
            addSelected={(value) => setFilters((prev) => [...prev, value])}
            removeSelected={(value) =>
              setFilters((prev) => prev.filter((v) => v !== value))
            }
            showClearButton={false}
            placeholder="Filters"
            className={clsx(
              "h-[56px] basis-1/3 rounded-b-none rounded-tr-none border-t-0 border-l-0 !shadow-none"
            )}
          />
          <SearchBox
            classNames={{
              root: clsx(
                "h-[56px] w-full rounded-tr relative border-b border-medusa-border-base dark:border-medusa-border-base-dark"
              ),
              form: clsx("h-full rounded-tr"),
              input: clsx(
                "w-full h-full pl-[60px] text-medusa-fg-subtle dark:text-medusa-fg-subtle-dark",
                "placeholder:text-medusa-fg-muted dark:placeholder:text-medusa-fg-muted-dark",
                "rounded-tr text-medium bg-medusa-bg-field dark:bg-medusa-bg-field-dark",
                "appearance-none search-cancel:hidden active:outline-none focus:outline-none"
              ),
              submit: clsx("absolute top-[18px] left-1.5"),
              reset: clsx(
                "absolute top-[18px] right-1 hover:bg-medusa-bg-field-hover dark:hover:bg-medusa-bg-field-hover-dark",
                "p-0.125 rounded"
              ),
              loadingIndicator: clsx("absolute top-[18px] right-1"),
            }}
            submitIconComponent={() => (
              <IconMagnifyingGlass iconColorClassName="stroke-medusa-fg-muted dark:stroke-medusa-fg-muted-dark" />
            )}
            resetIconComponent={() => (
              <IconXMark
                iconColorClassName="stroke-medusa-fg-muted dark:stroke-medusa-fg-muted-dark"
                className="hidden md:block"
              />
            )}
            placeholder="Find something..."
            autoFocus
          />
          <Button
            variant="clear"
            className={clsx(
              "bg-medusa-bg-field dark:bg-medusa-bg-field-dark block md:hidden",
              "border-medusa-border-base dark:border-medusa-border-base-dark border-b",
              "pr-1"
            )}
            onClick={() => setIsOpen(false)}
          >
            <IconXMark iconColorClassName="stroke-medusa-fg-muted dark:stroke-medusa-fg-muted-dark" />
          </Button>
        </div>
        <SearchEmptyQueryBoundary fallback={<SearchSuggestions />}>
          <SearchHitsWrapper
            configureProps={{
              filters: formattedFilters,
              attributesToSnippet: [
                "content",
                "hierarchy.lvl1",
                "hierarchy.lvl2",
              ],
              attributesToHighlight: [
                "content",
                "hierarchy.lvl1",
                "hierarchy.lvl2",
              ],
              hitsPerPage: 10,
            }}
          />
        </SearchEmptyQueryBoundary>
      </InstantSearch>
    </Modal>
  )
}

export default SearchModal
