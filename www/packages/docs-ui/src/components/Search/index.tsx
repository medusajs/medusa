"use client"

import React, { useEffect, useRef, useState } from "react"
import { InstantSearch, SearchBox } from "react-instantsearch"
import clsx from "clsx"
import { SearchEmptyQueryBoundary } from "./EmptyQueryBoundary"
import { SearchSuggestions, type SearchSuggestionType } from "./Suggestions"
import { AlgoliaProps, useSearch } from "@/providers"
import { checkArraySameElms } from "@/utils"
import { SearchHitsWrapper } from "./Hits"
import { Button, SelectBadge, SpinnerLoading } from "@/components"
import { XMark } from "@medusajs/icons"
import { useSearchNavigation, type OptionType } from "@/hooks"
import { SearchFooter } from "./Footer"

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
  filterOptions = [],
}: SearchProps) => {
  const { isOpen, setIsOpen, defaultFilters, searchClient, modalRef } =
    useSearch()
  const [filters, setFilters] = useState<string[]>(defaultFilters)
  const searchBoxRef = useRef<HTMLFormElement>(null)

  const focusSearchInput = () =>
    searchBoxRef.current?.querySelector("input")?.focus()

  useEffect(() => {
    if (!checkArraySameElms(defaultFilters, filters)) {
      setFilters(defaultFilters)
    }
  }, [defaultFilters])

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
      {filterOptions.length && (
        <SelectBadge
          multiple
          options={filterOptions}
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
          handleAddAll={(isAllSelected: boolean) => {
            if (isAllSelected) {
              setFilters(defaultFilters)
            } else {
              setFilters(filterOptions.map((option) => option.value))
            }
          }}
          className="px-docs_1 pt-docs_1 bg-medusa-bg-base z-10"
        />
      )}
      <InstantSearch
        indexName={algolia.mainIndexName}
        searchClient={searchClient}
        future={{
          preserveSharedStateOnUnmount: true,
        }}
      >
        <div className={clsx("bg-medusa-bg-base flex z-[1]")}>
          <SearchBox
            classNames={{
              root: clsx(
                "h-[57px] w-full md:rounded-t-docs_xl relative border-0 border-solid",
                "border-b border-medusa-border-base",
                "bg-transparent"
              ),
              form: clsx("h-full md:rounded-t-docs_xl bg-transparent"),
              input: clsx(
                "w-full h-full px-docs_1 py-docs_0.75 text-medusa-fg-base",
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
            formRef={searchBoxRef}
            loadingIconComponent={() => <SpinnerLoading />}
          />
        </div>
        <div className="md:flex-initial h-[calc(100%-95px)] lg:max-h-[calc(100%-140px)] lg:min-h-[calc(100%-140px)]">
          <SearchEmptyQueryBoundary
            fallback={<SearchSuggestions suggestions={suggestions} />}
          >
            <SearchHitsWrapper
              configureProps={{
                // filters array has to be wrapped
                // in another array for an OR condition
                // to be applied between the items.
                tagFilters: [filters],
              }}
              indices={algolia.indices}
              checkInternalPattern={checkInternalPattern}
            />
          </SearchEmptyQueryBoundary>
        </div>
      </InstantSearch>
      <SearchFooter />
    </div>
  )
}
