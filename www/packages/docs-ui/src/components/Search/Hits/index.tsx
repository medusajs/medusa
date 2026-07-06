"use client"

import React, { useEffect, useMemo, useState } from "react"
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
import { useSearch } from "@/providers/Search"
import { Badge } from "@/components/Badge"
import { Link } from "@/components/Link"
import { SearchHitGroupName } from "@/components/Search/Hits/GroupName"

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
  url_without_anchor: string
  type?: "lvl1" | "lvl2" | "lvl3" | "lvl4" | "lvl5" | "content"
  content?: string
  __position: number
  __queryID?: string
  objectID: string
  description?: string
  integration_vendor?: string
}

export type GroupedHitType = {
  [k: string]: HitType[]
}

export type SearchHitWrapperProps = {
  configureProps: ConfigureProps
} & Omit<SearchHitsProps, "indexName" | "setNoResults">

export type IndexResults = {
  [k: string]: boolean
}

export const SearchHitsWrapper = ({
  configureProps,
  ...rest
}: SearchHitWrapperProps) => {
  const { status } = useInstantSearch()
  const { selectedIndex, indices } = useSearch()
  const [hasNoResults, setHasNoResults] = useState<IndexResults>({
    ...indices.reduce((acc, index) => {
      acc[index.value] = false
      return acc
    }, {} as IndexResults),
  })
  const setNoResults = (index: string, value: boolean) => {
    setHasNoResults((prev) => ({
      ...prev,
      [index]: value,
    }))
  }
  const showNoResults = useMemo(() => {
    return Object.values(hasNoResults).every((val) => val)
  }, [hasNoResults])

  return (
    <div className="overflow-auto px-docs_0.5 flex-1">
      {status !== "loading" && showNoResults && <SearchNoResult />}
      {indices.map((index) => (
        <div
          className={clsx(index.value !== selectedIndex && "hidden")}
          key={index.value}
          data-index
        >
          {/* @ts-expect-error React v19 doesn't see this type as a React element */}
          <Index indexName={index.value}>
            {!hasNoResults[index.value] && (
              <SearchHitGroupName name={index.title} />
            )}
            <SearchHits
              indexName={index.value}
              setNoResults={setNoResults}
              {...rest}
            />
            <Configure {...configureProps} />
          </Index>
        </div>
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
  const { items: hits, sendEvent } = useHits<HitType>()
  const { status } = useInstantSearch()
  const { setIsOpen } = useSearch()

  useEffect(() => {
    if (status !== "loading" && status !== "stalled") {
      setNoResults(indexName, hits.length === 0)
    }
  }, [hits, status])

  const checkIfInternal = (url: string): boolean => {
    if (!checkInternalPattern) {
      return false
    }
    return checkInternalPattern.test(url)
  }

  const getHierarchySnippetAttribute = (
    hit: (typeof hits)[0]
  ): keyof HitType => {
    let prefix = "hierarchy."
    if (!hit._snippetResult?.hierarchy) {
      return (prefix + "lvl1") as keyof HitType
    }
    const entries = Object.entries(hit._snippetResult.hierarchy)
    const matchedLevel =
      entries.find(([, value]) => value.matchLevel === "full") ||
      entries.find(([, value]) => value.matchLevel === "partial")
    if (matchedLevel) {
      prefix += matchedLevel[0]
    } else {
      prefix += "lvl1"
    }
    return prefix as keyof HitType
  }

  return (
    <div
      className={clsx(
        "overflow-auto",
        "[&_mark]:bg-medusa-bg-highlight",
        "[&_mark]:text-medusa-fg-interactive"
      )}
      data-group
    >
      {hits.map((item, index) => {
        const hierarchies = Object.values(item.hierarchy)
          .filter(Boolean)
          .join(" › ")
        return (
          <div
            key={index}
            className={clsx(
              "p-docs_0.5",
              "hover:bg-medusa-bg-base-hover",
              "focus:bg-medusa-bg-base-hover",
              "focus:outline-none",
              "flex justify-between items-center"
            )}
            tabIndex={index}
            data-hit
            onClick={(e) => {
              const target = e.target as Element
              if (target.tagName.toLowerCase() === "div") {
                target.querySelector("a")?.click()
              }
            }}
          >
            <div
              className={clsx(
                "gap-docs_0.25 relative flex flex-1 flex-col",
                "overflow-x-hidden text-ellipsis whitespace-nowrap break-words"
              )}
            >
              <span
                className={clsx(
                  "text-compact-small-plus text-medusa-fg-base",
                  "max-w-full"
                )}
              >
                {/* @ts-expect-error React v19 doesn't see this type as a React element */}
                <Snippet
                  attribute={getHierarchySnippetAttribute(item)}
                  hit={item}
                />
              </span>
              <span className="text-compact-small text-medusa-fg-subtle text-ellipsis overflow-hidden">
                {item.type === "content" && (
                  <>
                    {/* @ts-expect-error React v19 doesn't see this type as a React element */}
                    <Snippet attribute={"content"} hit={item} />
                  </>
                )}
                {item.type !== "content" && item.description}
              </span>

              <span
                className={clsx(
                  "text-ellipsis overflow-hidden",
                  "text-medusa-fg-muted items-center text-compact-x-small"
                )}
              >
                {hierarchies}
              </span>
              <Link
                href={item.url}
                className="absolute top-0 left-0 h-full w-full"
                target="_self"
                onClick={(e) => {
                  sendEvent("click", item, "Search Result Clicked")
                  if (checkIfInternal(item.url)) {
                    e.preventDefault()
                    window.location.href = item.url
                    setIsOpen(false)
                  }
                }}
              />
            </div>
            {!!item.integration_vendor &&
              item.integration_vendor !== "Medusa" && (
                <Badge variant="blue" badgeType="shaded">
                  Community
                </Badge>
              )}
          </div>
        )
      })}
    </div>
  )
}
