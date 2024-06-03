"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { InstantSearch, SearchBox } from "react-instantsearch"
import clsx from "clsx"
import { SearchEmptyQueryBoundary } from "./EmptyQueryBoundary"
import { SearchSuggestions, type SearchSuggestionType } from "./Suggestions"
import { AlgoliaProps, useSearch } from "@/providers"
import { checkArraySameElms } from "@/utils"
import { SearchHitsWrapper } from "./Hits"
import { Button, Kbd, SelectBadge } from "@/components"
import { MagnifyingGlass, XMark } from "@medusajs/icons"
import { useSearchNavigation, type OptionType } from "@/hooks"

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
    <div className="h-full">
      <InstantSearch
        indexName={algolia.mainIndexName}
        searchClient={searchClient}
        future={{
          preserveSharedStateOnUnmount: true,
        }}
      >
        <div className={clsx("bg-medusa-bg-base flex")}>
          <SearchBox
            classNames={{
              root: clsx(
                "h-[57px] w-full md:rounded-t-docs_xl relative border-0 border-solid",
                "border-b border-medusa-border-base",
                "bg-transparent"
              ),
              form: clsx("h-full md:rounded-t-docs_xl bg-transparent"),
              input: clsx(
                "w-full h-full pl-docs_3 text-medusa-fg-base",
                "placeholder:text-medusa-fg-muted",
                "md:rounded-t-docs_xl text-compact-medium bg-transparent",
                "appearance-none search-cancel:hidden border-0 active:outline-none focus:outline-none"
              ),
              submit: clsx("absolute top-[18px] left-docs_1 btn-clear p-0"),
              reset: clsx(
                "absolute top-docs_0.75 right-docs_1 hover:bg-medusa-bg-base-hover",
                "p-[5px] md:rounded-docs_DEFAULT btn-clear"
              ),
              loadingIndicator: clsx("absolute top-[18px] right-docs_1"),
            }}
            submitIconComponent={() => (
              <MagnifyingGlass className="text-medusa-fg-muted" />
            )}
            resetIconComponent={() => (
              <XMark className="hidden md:block text-medusa-fg-subtle" />
            )}
            placeholder="Find something..."
            autoFocus
            formRef={searchBoxRef}
          />
          <Button
            variant="transparent"
            className={clsx(
              "bg-medusa-bg-base block md:hidden",
              "border-0 border-solid",
              "border-medusa-border-base border-b",
              "pr-docs_1"
            )}
            onClick={() => setIsOpen(false)}
          >
            <XMark className="text-medusa-fg-muted" />
          </Button>
        </div>
        <div className="mx-docs_0.5 md:flex-initial h-[calc(100%-120px)] md:h-[calc(100%-114px)] lg:max-h-[calc(100%-114px)] lg:min-h-[calc(100%-114px)]">
          <SearchEmptyQueryBoundary
            fallback={<SearchSuggestions suggestions={suggestions} />}
          >
            <SearchHitsWrapper
              configureProps={{
                filters: formattedFilters,
                attributesToSnippet: [
                  "content",
                  "hierarchy.lvl1",
                  "hierarchy.lvl2",
                  "hierarchy.lvl3",
                ],
                attributesToHighlight: [
                  "content",
                  "hierarchy.lvl1",
                  "hierarchy.lvl2",
                  "hierarchy.lvl3",
                ],
              }}
              indices={algolia.indices}
              checkInternalPattern={checkInternalPattern}
            />
          </SearchEmptyQueryBoundary>
        </div>
      </InstantSearch>
      <div
        className={clsx(
          "py-docs_0.75 flex items-center justify-between px-docs_1",
          "border-0 border-solid h-[57px]",
          "border-medusa-border-base border-t",
          "bg-medusa-bg-base"
        )}
      >
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
          />
        )}
        <div className="hidden items-center gap-docs_1 md:flex">
          <div className="flex items-center gap-docs_0.5">
            <span
              className={clsx("text-medusa-fg-subtle", "text-compact-x-small")}
            >
              Navigation
            </span>
            <span className="gap-docs_0.25 flex">
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd>
            </span>
          </div>
          <div className="flex items-center gap-docs_0.5">
            <span
              className={clsx("text-medusa-fg-subtle", "text-compact-x-small")}
            >
              Open Result
            </span>
            <Kbd>↵</Kbd>
          </div>
        </div>
      </div>
    </div>
  )
}
