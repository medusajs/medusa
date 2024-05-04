"use client"

import React, { Fragment, useEffect, useMemo, useState } from "react"
import clsx from "clsx"
import {
  Configure,
  ConfigureProps,
  Index,
  Snippet,
  useHits,
  useInstantSearch,
} from "react-instantsearch"
import { SearchNoResult } from "../NoResults"
import { SearchHitGroupName } from "./GroupName"
import { useSearch } from "@/providers"
import { Link } from "@/components"

export type Hierarchy = "lvl0" | "lvl1" | "lvl2" | "lvl3" | "lvl4" | "lvl5"

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

export type GroupedHitType = {
  [k: string]: HitType[]
}

export type SearchHitWrapperProps = {
  configureProps: ConfigureProps
  indices: string[]
} & Omit<SearchHitsProps, "indexName" | "setNoResults">

export type IndexResults = {
  [k: string]: boolean
}

export const SearchHitsWrapper = ({
  configureProps,
  indices,
  ...rest
}: SearchHitWrapperProps) => {
  const { status } = useInstantSearch()
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
          <SearchHits
            indexName={indexName}
            setNoResults={setNoResults}
            {...rest}
          />
          <Configure {...configureProps} />
        </Index>
      ))}
    </div>
  )
}

export type SearchHitsProps = {
  indexName: string
  setNoResults: (index: string, value: boolean) => void
  checkInternalPattern?: RegExp
}

export const SearchHits = ({
  indexName,
  setNoResults,
  checkInternalPattern,
}: SearchHitsProps) => {
  const { hits } = useHits<HitType>()
  const { status } = useInstantSearch()
  const { setIsOpen } = useSearch()

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
        .find(
          (key) =>
            item.hierarchy[key as Hierarchy] !== null &&
            item.hierarchy[key as Hierarchy] !== item.content
        ) || ""
    )
  }

  const checkIfInternal = (url: string): boolean => {
    if (!checkInternalPattern) {
      return false
    }
    return checkInternalPattern.test(url)
  }

  return (
    <div
      className={clsx(
        "overflow-auto",
        "[&_mark]:bg-medusa-bg-highlight",
        "[&_mark]:text-medusa-fg-interactive"
      )}
    >
      {Object.keys(grouped).map((groupName, index) => (
        <Fragment key={index}>
          <SearchHitGroupName name={groupName} />
          {grouped[groupName].map((item, index) => (
            <div
              className={clsx(
                "gap-docs_0.25 relative flex flex-1 flex-col p-docs_0.5",
                "overflow-x-hidden text-ellipsis whitespace-nowrap break-words",
                "hover:bg-medusa-bg-base-hover",
                "focus:bg-medusa-bg-base-hover",
                "last:mb-docs_1 focus:outline-none"
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
                  "text-compact-small-plus text-medusa-fg-base",
                  "max-w-full"
                )}
              >
                <Snippet
                  attribute={[
                    "hierarchy",
                    item.type && item.type !== "content"
                      ? item.type
                      : getLastAvailableHeirarchy(item) ||
                        item.hierarchy.lvl1 ||
                        "",
                  ]}
                  hit={item}
                  separator="."
                />
              </span>
              {item.type !== "lvl1" && (
                <span className="text-compact-small text-medusa-fg-subtle">
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
                onClick={(e) => {
                  if (checkIfInternal(item.url)) {
                    e.preventDefault()
                    window.location.href = item.url
                    setIsOpen(false)
                  }
                }}
              />
            </div>
          ))}
        </Fragment>
      ))}
    </div>
  )
}
