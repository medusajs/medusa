import React, { useEffect, useReducer, useRef, useState } from "react"
import clsx from "clsx"

import algoliaSearchHelper from "algoliasearch-helper"
import algoliaSearch from "algoliasearch/lite"

import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment"
import Head from "@docusaurus/Head"
import Link from "@docusaurus/Link"
import { useAllDocsData } from "@docusaurus/plugin-content-docs/client"
import {
  HtmlClassNameProvider,
  useEvent,
  usePluralForm,
  useSearchQueryString,
} from "@docusaurus/theme-common"
import { useTitleFormatter } from "@docusaurus/theme-common/internal"
import Translate, { translate } from "@docusaurus/Translate"
import useDocusaurusContext from "@docusaurus/useDocusaurusContext"
import { useSearchResultUrlProcessor } from "@docusaurus/theme-search-algolia/client"
import Layout from "@theme/Layout"
import { ThemeConfig } from "@medusajs/docs"
import UserProvider from "@site/src/providers/User"

// Very simple pluralization: probably good enough for now
function useDocumentsFoundPlural() {
  const { selectMessage } = usePluralForm()
  return (count: number) =>
    selectMessage(
      count,
      translate(
        {
          id: "theme.SearchPage.documentsFound.plurals",
          description: `Pluralized label for "{count} documents found". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)`,
          message: "One document found|{count} documents found",
        },
        { count }
      )
    )
}

function useDocsSearchVersionsHelpers() {
  const allDocsData = useAllDocsData()

  // State of the version select menus / algolia facet filters
  // docsPluginId -> versionName map
  const [searchVersions, setSearchVersions] = useState<{
    [pluginId: string]: string
  }>(() =>
    Object.entries(allDocsData).reduce(
      (acc, [pluginId, pluginData]) => ({
        ...acc,
        [pluginId]: pluginData.versions[0]!.name,
      }),
      {}
    )
  )

  // Set the value of a single select menu
  const setSearchVersion = (pluginId: string, searchVersion: string) =>
    setSearchVersions((s) => ({ ...s, [pluginId]: searchVersion }))

  const versioningEnabled = Object.values(allDocsData).some(
    (docsData) => docsData.versions.length > 1
  )

  return {
    allDocsData,
    versioningEnabled,
    searchVersions,
    setSearchVersion,
  }
}

// We want to display one select per versioned docs plugin instance
function SearchVersionSelectList({
  docsSearchVersionsHelpers,
}: {
  docsSearchVersionsHelpers: ReturnType<typeof useDocsSearchVersionsHelpers>
}) {
  const versionedPluginEntries = Object.entries(
    docsSearchVersionsHelpers.allDocsData
  )
    // Do not show a version select for unversioned docs plugin instances
    .filter(([, docsData]) => docsData.versions.length > 1)

  return (
    <div
      className={clsx(
        "col",
        "col--3",
        "tw-pl-0",
        "lg:!tw-max-w-[unset] xs:!tw-max-w-[40%] !tw-max-w-full",
        "xs:tw-pl-0 tw-pl-1"
      )}
    >
      {versionedPluginEntries.map(([pluginId, docsData]) => {
        const labelPrefix =
          versionedPluginEntries.length > 1 ? `${pluginId}: ` : ""
        return (
          <select
            key={pluginId}
            onChange={(e) =>
              docsSearchVersionsHelpers.setSearchVersion(
                pluginId,
                e.target.value
              )
            }
            defaultValue={docsSearchVersionsHelpers.searchVersions[pluginId]}
            className={clsx("search-page-input")}
          >
            {docsData.versions.map((version, i) => (
              <option
                key={i}
                label={`${labelPrefix}${version.label}`}
                value={version.name}
              />
            ))}
          </select>
        )
      })}
    </div>
  )
}

type ResultDispatcherState = {
  items: {
    title: string
    url: string
    summary: string
    breadcrumbs: string[]
  }[]
  query: string | null
  totalResults: number | null
  totalPages: number | null
  lastPage: number | null
  hasMore: boolean | null
  loading: boolean | null
}

type ResultDispatcher =
  | { type: "reset"; value?: undefined }
  | { type: "loading"; value?: undefined }
  | { type: "update"; value: ResultDispatcherState }
  | { type: "advance"; value?: undefined }

function SearchPageContent(): JSX.Element {
  const {
    siteConfig: { themeConfig },
  } = useDocusaurusContext()
  const {
    algolia: { appId, apiKey, indexName },
  } = themeConfig as ThemeConfig
  const processSearchResultUrl = useSearchResultUrlProcessor()
  const documentsFoundPlural = useDocumentsFoundPlural()

  const docsSearchVersionsHelpers = useDocsSearchVersionsHelpers()
  const [searchQuery, setSearchQuery] = useSearchQueryString()
  const initialSearchResultState: ResultDispatcherState = {
    items: [],
    query: null,
    totalResults: null,
    totalPages: null,
    lastPage: null,
    hasMore: null,
    loading: null,
  }
  const [searchResultState, searchResultStateDispatcher] = useReducer(
    (prevState: ResultDispatcherState, data: ResultDispatcher) => {
      switch (data.type) {
        case "reset": {
          return initialSearchResultState
        }
        case "loading": {
          return { ...prevState, loading: true }
        }
        case "update": {
          if (searchQuery !== data.value.query) {
            return prevState
          }

          return {
            ...data.value,
            items:
              data.value.lastPage === 0
                ? data.value.items
                : prevState.items.concat(data.value.items),
          }
        }
        case "advance": {
          const hasMore = prevState.totalPages! > prevState.lastPage! + 1

          return {
            ...prevState,
            lastPage: hasMore ? prevState.lastPage! + 1 : prevState.lastPage,
            hasMore,
          }
        }
        default:
          return prevState
      }
    },
    initialSearchResultState
  )

  const algoliaClient = algoliaSearch(appId, apiKey)
  const algoliaHelper = algoliaSearchHelper(algoliaClient, indexName, {
    hitsPerPage: 15,
    advancedSyntax: true,
    disjunctiveFacets: ["language", "docusaurus_tag"],
  })

  algoliaHelper.on(
    "result",
    ({ results: { query, hits, page, nbHits, nbPages } }) => {
      if (query === "" || !Array.isArray(hits)) {
        searchResultStateDispatcher({ type: "reset" })
        return
      }

      const sanitizeValue = (value: string) =>
        value.replace(
          /algolia-docsearch-suggestion--highlight/g,
          "search-result-match"
        )

      const items = hits.map(
        ({
          url,
          _highlightResult: { hierarchy },
          _snippetResult: snippet = {},
        }: {
          url: string
          _highlightResult: { hierarchy: { [key: string]: { value: string } } }
          _snippetResult: { content?: { value: string } }
        }) => {
          const titles = Object.keys(hierarchy).map((key) =>
            sanitizeValue(hierarchy[key]!.value)
          )
          return {
            title: titles.pop()!,
            url: processSearchResultUrl(url),
            summary: snippet.content
              ? `${sanitizeValue(snippet.content.value)}...`
              : "",
            breadcrumbs: titles,
          }
        }
      )

      searchResultStateDispatcher({
        type: "update",
        value: {
          items,
          query,
          totalResults: nbHits,
          totalPages: nbPages,
          lastPage: page,
          hasMore: nbPages > page + 1,
          loading: false,
        },
      })
    }
  )

  const [loaderRef, setLoaderRef] = useState<HTMLDivElement | null>(null)
  const prevY = useRef(0)
  const observer = useRef(
    ExecutionEnvironment.canUseIntersectionObserver &&
      new IntersectionObserver(
        (entries) => {
          const {
            isIntersecting,
            boundingClientRect: { y: currentY },
          } = entries[0]!

          if (isIntersecting && prevY.current > currentY) {
            searchResultStateDispatcher({ type: "advance" })
          }

          prevY.current = currentY
        },
        { threshold: 1 }
      )
  )

  const getTitle = () => {
    return searchQuery
      ? translate(
          {
            id: "theme.SearchPage.existingResultsTitle",
            message: `Search results for "{query}"`,
            description: "The search page title for non-empty query",
          },
          {
            query: searchQuery,
          }
        )
      : translate({
          id: "theme.SearchPage.emptyResultsTitle",
          message: "Search the documentation",
          description: "The search page title for empty query",
        })
  }

  const makeSearch = useEvent((page?: number) => {
    // These commented out line are from algolia's implementation
    // we might need them in the future
    // algoliaHelper.addDisjunctiveFacetRefinement("docusaurus_tag", "default")
    // algoliaHelper.addDisjunctiveFacetRefinement("language", currentLocale)

    // Object.entries(docsSearchVersionsHelpers.searchVersions).forEach(
    //   ([pluginId, searchVersion]) => {
    //     algoliaHelper.addDisjunctiveFacetRefinement(
    //       "docusaurus_tag",
    //       `docs-${pluginId}-${searchVersion}`
    //     )
    //   }
    // )

    algoliaHelper
      .setQuery(searchQuery)
      .setPage(page || 0)
      .search()
  })

  useEffect(() => {
    if (!loaderRef) {
      return undefined
    }
    const currentObserver = observer.current
    if (currentObserver) {
      currentObserver.observe(loaderRef)
      return () => currentObserver.unobserve(loaderRef)
    }
    return () => true
  }, [loaderRef])

  useEffect(() => {
    searchResultStateDispatcher({ type: "reset" })

    if (searchQuery) {
      searchResultStateDispatcher({ type: "loading" })

      setTimeout(() => {
        makeSearch()
      }, 300)
    }
  }, [searchQuery, docsSearchVersionsHelpers.searchVersions, makeSearch])

  useEffect(() => {
    if (!searchResultState.lastPage || searchResultState.lastPage === 0) {
      return
    }

    makeSearch(searchResultState.lastPage)
  }, [makeSearch, searchResultState.lastPage])

  return (
    <Layout>
      <Head>
        <title>{useTitleFormatter(getTitle())}</title>
        {/*
         We should not index search pages
          See https://github.com/facebook/docusaurus/pull/3233
        */}
        <meta property="robots" content="noindex, follow" />
      </Head>

      <div className={clsx("container", "tw-mt-2")}>
        <h1>{getTitle()}</h1>

        <form className="row" onSubmit={(e) => e.preventDefault()}>
          <div
            className={clsx(
              "col",
              "lg:tw-max-w-[unset] xs:tw-max-w-[60%] tw-max-w-full",
              {
                "col--9": docsSearchVersionsHelpers.versioningEnabled,
                "col--12": !docsSearchVersionsHelpers.versioningEnabled,
              }
            )}
          >
            <input
              type="search"
              name="q"
              className={clsx(
                "search-page-input",
                "placeholder:tw-text-medusa-text-subtle dark:placeholder:tw-text-medusa-text-subtle-dark"
              )}
              placeholder={translate({
                id: "theme.SearchPage.inputPlaceholder",
                message: "Type your search here",
                description: "The placeholder for search page input",
              })}
              aria-label={translate({
                id: "theme.SearchPage.inputLabel",
                message: "Search",
                description: "The ARIA label for search page input",
              })}
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
              autoComplete="off"
              autoFocus
            />
          </div>

          {docsSearchVersionsHelpers.versioningEnabled && (
            <SearchVersionSelectList
              docsSearchVersionsHelpers={docsSearchVersionsHelpers}
            />
          )}
        </form>

        <div className="row">
          <div className={clsx("col", "col--8", "!tw-text-label-small-plus")}>
            {!!searchResultState.totalResults &&
              documentsFoundPlural(searchResultState.totalResults)}
          </div>
        </div>

        {searchResultState.items.length > 0 ? (
          <main>
            {searchResultState.items.map(
              ({ title, url, summary, breadcrumbs }, i) => (
                <article
                  key={i}
                  className={clsx(
                    "tw-py-1 tw-px-0 tw-border-b tw-border-t-0 tw-border-x-0 tw-border-solid",
                    "tw-border-medusa-border-base dark:tw-border-medusa-border-base-dark",
                    "!tw-max-w-[unset]"
                  )}
                >
                  <h2 className={clsx("tw-font-normal tw-mb-0.5")}>
                    <Link
                      to={url}
                      dangerouslySetInnerHTML={{ __html: title }}
                      className={clsx(
                        "tw-text-medusa-text-base dark:tw-text-medusa-text-base-dark"
                      )}
                    />
                  </h2>

                  {breadcrumbs.length > 0 && (
                    <nav aria-label="breadcrumbs">
                      <ul
                        className={clsx(
                          "tw-mb-0 tw-pl-0",
                          "!tw-text-label-x-small-plus tw-text-medusa-text-subtle dark:tw-text-medusa-text-subtle-dark"
                        )}
                      >
                        {breadcrumbs.map((html, index) => (
                          <li
                            key={index}
                            className="breadcrumbs__item"
                            // Developer provided the HTML, so assume it's safe.
                            // eslint-disable-next-line react/no-danger
                            dangerouslySetInnerHTML={{ __html: html }}
                          />
                        ))}
                      </ul>
                    </nav>
                  )}

                  {summary && (
                    <p
                      className={clsx("tw-mt-0.5 tw-mb-0 tw-mx-0")}
                      // Developer provided the HTML, so assume it's safe.
                      // eslint-disable-next-line react/no-danger
                      dangerouslySetInnerHTML={{ __html: summary }}
                    />
                  )}
                </article>
              )
            )}
          </main>
        ) : (
          [
            searchQuery && !searchResultState.loading && (
              <p key="no-results">
                <Translate
                  id="theme.SearchPage.noResultsText"
                  description="The paragraph for empty search result"
                >
                  No results were found
                </Translate>
              </p>
            ),
            !!searchResultState.loading && (
              <div
                key="spinner"
                className={clsx(
                  "tw-w-3 tw-h-3 tw-border-0.4 tw-border-solid tw-border-[#eee] tw-border-t-medusa-text-base dark:tw-border-t-medusa-text-base-dark",
                  "tw-rounded-[50%] tw-animate-spin tw-my-0 tw-mx-auto"
                )}
              />
            ),
          ]
        )}

        {searchResultState.hasMore && (
          <div className={clsx("tw-mt-2")} ref={setLoaderRef}>
            <Translate
              id="theme.SearchPage.fetchingNewResults"
              description="The paragraph for fetching new search results"
            >
              Fetching new results...
            </Translate>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default function SearchPage(): JSX.Element {
  return (
    <HtmlClassNameProvider className="">
      <UserProvider>
        <SearchPageContent />
      </UserProvider>
    </HtmlClassNameProvider>
  )
}
