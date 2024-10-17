"use client"

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useRef,
} from "react"
import { BadgeProps, Modal, Search, SearchProps } from "@/components"
import { checkArraySameElms } from "../../utils"
import {
  liteClient as algoliasearch,
  LiteClient as SearchClient,
  type SearchResponses,
  type SearchHits,
  SearchResponse,
} from "algoliasearch/lite"
import clsx from "clsx"
import { CSSTransition, SwitchTransition } from "react-transition-group"

export type SearchCommand = {
  name: string
  component: React.ReactNode
  icon?: React.ReactNode
  title: string
  badge?: BadgeProps
}

export type SearchContextType = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  defaultFilters: string[]
  setDefaultFilters: (value: string[]) => void
  searchClient: SearchClient
  commands: SearchCommand[]
  command: SearchCommand | null
  setCommand: React.Dispatch<React.SetStateAction<SearchCommand | null>>
  modalRef: React.MutableRefObject<HTMLDialogElement | null>
}

const SearchContext = createContext<SearchContextType | null>(null)

export type AlgoliaProps = {
  appId: string
  apiKey: string
  mainIndexName: string
  indices: string[]
}

export type SearchProviderProps = {
  children: React.ReactNode
  initialDefaultFilters?: string[]
  algolia: AlgoliaProps
  searchProps: Omit<SearchProps, "algolia">
  commands?: SearchCommand[]
  modalClassName?: string
}

export const SearchProvider = ({
  children,
  initialDefaultFilters = [],
  searchProps,
  algolia,
  commands = [],
  modalClassName,
}: SearchProviderProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [defaultFilters, setDefaultFilters] = useState<string[]>(
    initialDefaultFilters
  )
  const [command, setCommand] = useState<SearchCommand | null>(null)

  const modalRef = useRef<HTMLDialogElement | null>(null)

  const searchClient: SearchClient = useMemo(() => {
    const algoliaClient = algoliasearch(algolia.appId, algolia.apiKey)
    return {
      ...algoliaClient,
      async search(searchParams) {
        const requests =
          "requests" in searchParams ? searchParams.requests : searchParams
        // always send this request, which is the main request with no filters
        const mainRequest = requests[0]

        // retrieve only requests that have filters
        // this is to ensure that we show no result if no filter is selected
        const requestsWithFilters = requests.filter((item) => {
          if (
            !item.params ||
            typeof item.params !== "object" ||
            !("tagFilters" in item.params)
          ) {
            return false
          }

          const tagFilters = item.params.tagFilters as string[]

          // if no tag filters are specified, there's still one item,
          // which is an empty array
          return tagFilters.length >= 1 && tagFilters[0].length > 0
        })

        // check whether a query is entered in the search box
        const noQueries = requestsWithFilters.every(
          (item) =>
            !item.facetQuery &&
            (!item.params ||
              typeof item.params !== "object" ||
              !("query" in item.params) ||
              !item.params.query)
        )

        if (noQueries) {
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

        // split requests per tags
        const newRequests: typeof requestsWithFilters = [mainRequest]
        for (const request of requestsWithFilters) {
          const params = request.params as Record<string, unknown>
          const tagFilters = (params.tagFilters as string[][])[0]

          // if only one tag is selected, keep the request as-is
          if (tagFilters.length === 1) {
            newRequests.push(request)

            continue
          }

          // if multiple tags are selected, split the tags
          // to retrieve a small subset of results per each tag.
          newRequests.push(
            ...tagFilters.map((tag) => ({
              ...request,
              params: {
                ...params,
                tagFilters: [tag],
              },
              hitsPerPage: 4,
            }))
          )
        }

        return algoliaClient
          .search<SearchHits>(newRequests)
          .then((response) => {
            // combine results of the same index and return the results
            const resultsByIndex: {
              [indexName: string]: SearchResponse<SearchHits>
            } = {}
            // extract the response of the main request
            const mainResult = response.results[0]

            response.results.forEach((result, indexNum) => {
              if (indexNum === 0) {
                // ignore the main request's result
                return
              }
              const resultIndex = "index" in result ? result.index : undefined
              const resultHits = "hits" in result ? result.hits : []

              if (!resultIndex) {
                return
              }

              resultsByIndex[resultIndex] = {
                ...result,
                ...(resultsByIndex[resultIndex] || {}),
                hits: [
                  ...(resultsByIndex[resultIndex]?.hits || []),
                  ...resultHits,
                ],
                nbHits:
                  (resultsByIndex[resultIndex]?.nbHits || 0) +
                  resultHits.length,
              }
            })

            return {
              // append the results with the main request's results
              results: [mainResult, ...Object.values(resultsByIndex)],
            } as SearchResponses<any>
          })
      },
    }
  }, [algolia.appId, algolia.apiKey])

  useEffect(() => {
    if (
      initialDefaultFilters.length &&
      !checkArraySameElms(defaultFilters, initialDefaultFilters)
    ) {
      setDefaultFilters(initialDefaultFilters)
    }
  }, [initialDefaultFilters])

  return (
    <SearchContext.Provider
      value={{
        isOpen,
        setIsOpen,
        defaultFilters,
        setDefaultFilters,
        searchClient,
        commands,
        command,
        setCommand,
        modalRef,
      }}
    >
      {children}
      <Modal
        contentClassName={clsx(
          "!p-0 overflow-hidden relative h-full",
          "flex flex-col justify-between"
        )}
        modalContainerClassName="!h-[480px] max-h-[480px]"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        passedRef={modalRef}
        className={modalClassName}
      >
        <SwitchTransition>
          <CSSTransition
            classNames={{
              enter:
                command === null
                  ? "animate-fadeInLeft animate-fast"
                  : "animate-fadeInRight animate-fast",
              exit:
                command === null
                  ? "animate-fadeOutLeft animate-fast"
                  : "animate-fadeOutRight animate-fast",
            }}
            timeout={250}
            key={command?.name || "search"}
          >
            <>
              {command === null && (
                <Search {...searchProps} algolia={algolia} />
              )}
              {command?.component}
            </>
          </CSSTransition>
        </SwitchTransition>
      </Modal>
    </SearchContext.Provider>
  )
}

export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext)

  if (!context) {
    throw new Error("useSearch must be used inside a SearchProvider")
  }

  return context
}
