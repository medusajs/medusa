"use client"

import React, { useEffect, useRef } from "react"
import { InstantSearch, SearchBox } from "react-instantsearch"
import clsx from "clsx"
import { SearchEmptyQueryBoundary } from "./EmptyQueryBoundary"
import { SearchSuggestions, type SearchSuggestionType } from "./Suggestions"
import { AlgoliaProps, useSearch } from "@/providers/Search"
import { SearchHitsWrapper } from "./Hits"
import { SpinnerLoading } from "@/components/Loading/Spinner"
import { useSearchNavigation } from "@/hooks/use-search-navigation"
import { OptionType } from "@/hooks/use-select"
import { SearchFooter } from "./Footer"
import { SearchFilters } from "./Filters"
import { SearchCallout } from "./Callout"

export type SearchProps = {
  algolia: AlgoliaProps
  isLoading?: boolean
  suggestions: SearchSuggestionType[]
  checkInternalPattern?: RegExp
  filterOptions?: OptionType[]
}

export const Search = ({
  algolia,
  suggestions,
  isLoading = false,
  checkInternalPattern,
}: SearchProps) => {
  const { isOpen, searchClient, modalRef } = useSearch()
  const searchBoxRef = useRef<HTMLFormElement>(null)

  const focusSearchInput = () =>
    searchBoxRef.current?.querySelector("input")?.focus()

  useEffect(() => {
    if (isOpen && searchBoxRef.current) {
      focusSearchInput()
    } else if (!isOpen) {
      const focusedItem = modalRef.current?.querySelector(
        ":focus"
      ) as HTMLElement
      if (
        focusedItem &&
        focusedItem === searchBoxRef.current?.querySelector("input")
      ) {
        // remove focus
        focusedItem.blur()
      }
    }
  }, [isOpen])

  useSearchNavigation({
    getInputElm: () =>
      searchBoxRef.current?.querySelector("input") as HTMLInputElement,
    focusInput: focusSearchInput,
    keyboardProps: {
      isLoading,
    },
  })

  return (
    <div className="h-full flex flex-col">
      {/* @ts-expect-error React v19 doesn't see this type as a React element */}
      <InstantSearch
        indexName={algolia.mainIndexName}
        searchClient={searchClient}
        future={{
          preserveSharedStateOnUnmount: true,
        }}
        insights={true}
      >
        <div className={clsx("bg-medusa-bg-base flex z-[1]")}>
          {/* @ts-expect-error React v19 doesn't see this type as a React element */}
          <SearchBox
            classNames={{
              root: clsx(
                "h-[57px] w-full md:rounded-t-docs_xl relative border-0 border-solid",
                "border-b border-medusa-border-base",
                "bg-transparent"
              ),
              form: clsx("h-full md:rounded-t-docs_xl bg-transparent"),
              input: clsx(
                "w-[calc(100%-40px)] h-full px-docs_1 py-docs_0.75 text-medusa-fg-base",
                "placeholder:text-medusa-fg-muted bg-medusa-bg-base",
                "md:rounded-t-docs_xl text-compact-large sm:text-compact-medium",
                "appearance-none search-cancel:hidden border-0 active:outline-none focus:outline-none"
              ),
              submit: clsx("absolute top-[18px] left-docs_1 btn-clear p-0"),
              reset: clsx("absolute top-[18px] right-docs_1", "btn-clear"),
              loadingIndicator: clsx("absolute top-[18px] right-docs_1"),
            }}
            submitIconComponent={() => <></>}
            resetIconComponent={() => (
              <span className="text-medusa-fg-muted text-compact-small-plus hover:text-medusa-fg-subtle">
                Clear
              </span>
            )}
            placeholder="Find something..."
            autoFocus
            formRef={searchBoxRef as React.RefObject<HTMLFormElement>}
            loadingIconComponent={() => <SpinnerLoading />}
          />
        </div>
        <div
          className={clsx(
            "md:flex-initial flex flex-col",
            "h-[calc(100%-75px)] lg:max-h-[calc(100%-100px)] lg:min-h-[calc(100%-100px)]"
          )}
        >
          <SearchFilters />
          <SearchEmptyQueryBoundary
            fallback={<SearchSuggestions suggestions={suggestions} />}
          >
            <SearchCallout />
            <SearchHitsWrapper
              configureProps={{}}
              checkInternalPattern={checkInternalPattern}
            />
          </SearchEmptyQueryBoundary>
        </div>
      </InstantSearch>
      <SearchFooter />
    </div>
  )
}
