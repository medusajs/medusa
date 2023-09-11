import React from "react"
import clsx from "clsx"
import { Fragment, useEffect, useMemo, useState } from "react"
import {
  Configure,
  ConfigureProps,
  Index,
  Snippet,
  useHits,
  useInstantSearch,
} from "react-instantsearch"
import SearchNoResult from "../NoResults"
import SearchHitGroupName from "./GroupName"
import Link from "@docusaurus/Link"
import { useThemeConfig } from "@docusaurus/theme-common"
import { ThemeConfig } from "@medusajs/docs"

type Hierarchy = "lvl0" | "lvl1" | "lvl2" | "lvl3" | "lvl4" | "lvl5"

export type HitType = {
  hierarchy: {
    lvl0: string | null
    lvl1: string | null
    lvl2: string | null
    lvl3: string | null
    lvl4: string | null
    lvl5: string | null
  }
  _tags: string[]
  url: string
  type?: "lvl1" | "lvl2" | "lvl3" | "lvl4" | "lvl5" | "content"
  content?: string
  __position: number
  __queryID?: string
  objectID: string
}

type GroupedHitType = {
  [k: string]: HitType[]
}

type SearchHitWrapperProps = {
  configureProps: ConfigureProps
}

type IndexResults = {
  [k: string]: boolean
}

const SearchHitsWrapper = ({ configureProps }: SearchHitWrapperProps) => {
  const { status } = useInstantSearch()
  const { algoliaConfig: algolia } = useThemeConfig() as ThemeConfig
  const indices = useMemo(() => Object.values(algolia.indexNames), [])
  const [hasNoResults, setHashNoResults] = useState<IndexResults>({
    [indices[0]]: false,
    [indices[1]]: false,
  })
  const showNoResults = useMemo(() => {
    return Object.values(hasNoResults).every((value) => value === true)
  }, [hasNoResults])

  const setNoResults = (index: string, value: boolean) => {
    setHashNoResults((prev: IndexResults) => ({
      ...prev,
      [index]: value,
    }))
  }

  return (
    <div className="h-full overflow-auto">
      {status !== "loading" && showNoResults && <SearchNoResult />}
      {indices.map((indexName, index) => (
        <Index indexName={indexName} key={index}>
          <SearchHits indexName={indexName} setNoResults={setNoResults} />
          <Configure {...configureProps} />
        </Index>
      ))}
    </div>
  )
}

type SearchHitsProps = {
  indexName: string
  setNoResults: (index: string, value: boolean) => void
}

const SearchHits = ({ indexName, setNoResults }: SearchHitsProps) => {
  const { hits } = useHits<HitType>()
  const { status } = useInstantSearch()

  // group by lvl0
  const grouped = useMemo(() => {
    const grouped: GroupedHitType = {}
    hits.forEach((hit) => {
      if (hit.hierarchy.lvl0) {
        if (!grouped[hit.hierarchy.lvl0]) {
          grouped[hit.hierarchy.lvl0] = []
        }
        grouped[hit.hierarchy.lvl0].push(hit)
      }
    })

    return grouped
  }, [hits])

  useEffect(() => {
    if (status !== "loading" && status !== "stalled") {
      setNoResults(indexName, hits.length === 0)
    }
  }, [hits, status])

  const getLastAvailableHeirarchy = (item: HitType) => {
    return (
      Object.keys(item.hierarchy)
        .reverse()
        .find((key) => item.hierarchy[key as Hierarchy] !== null) || ""
    )
  }

  return (
    <div className="overflow-auto">
      {Object.keys(grouped).map((groupName, index) => (
        <Fragment key={index}>
          <SearchHitGroupName name={groupName} />
          {grouped[groupName].map((item, index) => (
            <div
              className={clsx(
                "gap-0.25 relative flex flex-1 flex-col p-0.5",
                "overflow-x-hidden text-ellipsis whitespace-nowrap break-words",
                "hover:bg-medusa-bg-base-hover dark:hover:bg-medusa-bg-base-hover-dark",
                "focus:bg-medusa-bg-base-hover dark:focus:bg-medusa-bg-base-hover-dark",
                "focus:outline-none last:mb-1"
              )}
              key={index}
              tabIndex={index}
              data-hit
              onClick={(e) => {
                const target = e.target as Element
                if (target.tagName.toLowerCase() === "div") {
                  target.querySelector("a")?.click()
                }
              }}
            >
              <span
                className={clsx(
                  "text-compact-small-plus text-medusa-fg-base dark:text-medusa-fg-base-dark",
                  "max-w-full"
                )}
              >
                <Snippet
                  attribute={[
                    "hierarchy",
                    item.type && item.type !== "content"
                      ? item.type
                      : item.hierarchy.lvl1
                      ? "lvl1"
                      : getLastAvailableHeirarchy(item),
                  ]}
                  hit={item}
                />
              </span>
              {item.type !== "lvl1" && (
                <span className="text-compact-small text-medusa-fg-subtle dark:text-medusa-fg-subtle-dark">
                  <Snippet
                    attribute={
                      item.content
                        ? "content"
                        : [
                            "hierarchy",
                            item.type || getLastAvailableHeirarchy(item),
                          ]
                    }
                    hit={item}
                  />
                </span>
              )}
              <Link
                href={item.url}
                className="absolute top-0 left-0 h-full w-full"
                target="_self"
              />
            </div>
          ))}
        </Fragment>
      ))}
    </div>
  )
}

export default SearchHitsWrapper
