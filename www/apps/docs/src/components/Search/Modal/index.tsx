import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import algoliasearch, { SearchClient } from "algoliasearch/lite"
import { InstantSearch, SearchBox } from "react-instantsearch"
import Modal from "../../Modal"
import clsx from "clsx"
import SearchEmptyQueryBoundary from "../EmptyQueryBoundary"
import SearchSuggestions from "../Suggestions"
import checkArraySameElms from "../../../utils/array-same-elms"
import SearchHitsWrapper from "../Hits"
import Button from "../../Button"
import useKeyboardShortcut from "../../../hooks/use-keyboard-shortcut"
import { OptionType } from "@medusajs/docs"
import { useSearch } from "../../../providers/Search"
import { findNextSibling, findPrevSibling } from "../../../utils/dom-utils"
import IconMagnifyingGlass from "../../../theme/Icon/MagnifyingGlass"
import IconXMark from "../../../theme/Icon/XMark"
import SelectBadge from "../../Select/Badge"
import Kbd from "../../../theme/MDXComponents/Kbd"
import { useThemeConfig } from "@docusaurus/theme-common"
import { ThemeConfig } from "@medusajs/docs"

const SearchModal = () => {
  const modalRef = useRef<HTMLDialogElement | null>(null)
  const { algoliaConfig: algolia } = useThemeConfig() as ThemeConfig

  if (!algolia) {
    throw new Error("Algolia configuration is not defined")
  }

  const algoliaClient = useMemo(() => {
    return algoliasearch(algolia.appId, algolia.apiKey)
  }, [])

  const searchClient: SearchClient = useMemo(() => {
    return {
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
  }, [])

  const options: OptionType[] = algolia.filters
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

  const handleKeyAction = (e: KeyboardEvent) => {
    if (!isOpen) {
      return
    }
    e.preventDefault()
    const focusedItem = modalRef.current?.querySelector(":focus") as HTMLElement
    if (!focusedItem) {
      // focus the first data-hit
      const nextItem = modalRef.current?.querySelector(
        "[data-hit]"
      ) as HTMLElement
      nextItem?.focus()
      return
    }

    const isHit = focusedItem.hasAttribute("data-hit")
    const isInput = focusedItem.tagName.toLowerCase() === "input"

    if (!isHit && !isInput) {
      // ignore if focused items aren't input/data-hit
      return
    }

    const lowerPressedKey = e.key.toLowerCase()

    if (lowerPressedKey === "enter") {
      if (isHit) {
        // trigger click event of the focused element
        focusedItem.click()
      }
      return
    }

    if (lowerPressedKey === "arrowup") {
      // only hit items has action on arrow up
      if (isHit) {
        // find if there's a data-hit item before this one
        const beforeItem = findPrevSibling(focusedItem, "[data-hit]")
        if (!beforeItem) {
          // focus the input
          focusSearchInput()
        } else {
          // focus the previous item
          beforeItem.focus()
        }
      }
    } else if (lowerPressedKey === "arrowdown") {
      // check if item is input or hit
      if (isInput) {
        // go to the first data-hit item
        const nextItem = modalRef.current?.querySelector(
          "[data-hit]"
        ) as HTMLElement
        nextItem?.focus()
      } else {
        // handle go down for hit items
        // find if there's a data-hit item after this one
        const afterItem = findNextSibling(focusedItem, "[data-hit]")
        if (afterItem) {
          // focus the next item
          afterItem.focus()
        }
      }
    }
  }

  const shortcutKeys = useMemo(() => ["ArrowUp", "ArrowDown", "Enter"], [])

  useKeyboardShortcut({
    metakey: false,
    shortcutKeys,
    action: handleKeyAction,
    checkEditing: false,
    preventDefault: false,
  })

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) {
        return
      }
      // check if shortcut keys were pressed
      const lowerPressedKey = e.key.toLowerCase()
      const pressedShortcut = [...shortcutKeys, "Escape"].some(
        (s) => s.toLowerCase() === lowerPressedKey
      )
      if (pressedShortcut) {
        return
      }

      const focusedItem = modalRef.current?.querySelector(
        ":focus"
      ) as HTMLElement
      const searchInput = searchBoxRef.current?.querySelector(
        "input"
      ) as HTMLInputElement
      if (searchInput && focusedItem !== searchInput) {
        searchInput.focus()
      }
    },
    [shortcutKeys, isOpen]
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])

  return (
    <Modal
      contentClassName={clsx(
        "!p-0 overflow-hidden relative h-full",
        "rounded-none md:rounded-lg flex flex-col justify-between"
      )}
      modalContainerClassName="w-screen h-screen !rounded-none md:!rounded-lg"
      open={isOpen}
      onClose={() => setIsOpen(false)}
      ref={modalRef}
    >
      <InstantSearch
        indexName={algolia.indexNames.docs}
        searchClient={searchClient}
      >
        <div
          className={clsx("bg-medusa-bg-base dark:bg-medusa-bg-base-dark flex")}
        >
          <SearchBox
            classNames={{
              root: clsx(
                "h-[56px] w-full md:rounded-t-xl relative border-0 border-solid",
                "border-b border-medusa-border-base dark:border-medusa-border-base-dark",
                "bg-transparent"
              ),
              form: clsx("h-full md:rounded-t-xl bg-transparent"),
              input: clsx(
                "w-full h-full pl-3 text-medusa-fg-base dark:text-medusa-fg-base-dark",
                "placeholder:text-medusa-fg-muted dark:placeholder:text-medusa-fg-muted-dark",
                "md:rounded-t-xl text-compact-medium bg-transparent",
                "appearance-none search-cancel:hidden border-0 active:outline-none focus:outline-none"
              ),
              submit: clsx("absolute top-[18px] left-1 btn-clear p-0"),
              reset: clsx(
                "absolute top-0.75 right-1 hover:bg-medusa-bg-base-hover dark:hover:bg-medusa-bg-base-hover-dark",
                "p-[5px] md:rounded btn-clear"
              ),
              loadingIndicator: clsx("absolute top-[18px] right-1"),
            }}
            submitIconComponent={() => (
              <IconMagnifyingGlass iconColorClassName="stroke-medusa-fg-muted dark:stroke-medusa-fg-muted-dark" />
            )}
            resetIconComponent={() => (
              <IconXMark
                iconColorClassName="stroke-medusa-fg-subtle dark:stroke-medusa-fg-subtle-dark"
                className="hidden md:block"
              />
            )}
            placeholder="Find something..."
            autoFocus
            formRef={searchBoxRef}
          />
          <Button
            variant="clear"
            className={clsx(
              "bg-medusa-bg-base dark:bg-medusa-bg-base-dark block md:hidden",
              "border-0 border-solid",
              "border-medusa-border-base dark:border-medusa-border-base-dark border-b",
              "pr-1"
            )}
            onClick={() => setIsOpen(false)}
          >
            <IconXMark iconColorClassName="stroke-medusa-fg-muted dark:stroke-medusa-fg-muted-dark" />
          </Button>
        </div>
        <div className="mx-0.5 h-[calc(100%-120px)] md:h-[332px] md:flex-initial lg:max-h-[332px] lg:min-h-[332px]">
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
              }}
            />
          </SearchEmptyQueryBoundary>
        </div>
      </InstantSearch>
      <div
        className={clsx(
          "py-0.75 flex items-center justify-between px-1",
          "border-0 border-solid",
          "border-medusa-border-base dark:border-medusa-border-base-dark border-t",
          "bg-medusa-bg-base dark:bg-medusa-bg-base-dark"
        )}
      >
        <SelectBadge
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
          handleAddAll={(isAllSelected: boolean) => {
            if (isAllSelected) {
              setFilters(defaultFilters)
            } else {
              setFilters(options.map((option) => option.value))
            }
          }}
        />
        <div className="hidden items-center gap-1 md:flex">
          <div className="flex items-center gap-0.5">
            <span
              className={clsx(
                "text-medusa-fg-subtle dark:text-medusa-fg-subtle-dark",
                "text-compact-x-small"
              )}
            >
              Navigation
            </span>
            <span className="gap-0.25 flex">
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd>
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            <span
              className={clsx(
                "text-medusa-fg-subtle dark:text-medusa-fg-subtle-dark",
                "text-compact-x-small"
              )}
            >
              Open Result
            </span>
            <Kbd>↵</Kbd>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default SearchModal
