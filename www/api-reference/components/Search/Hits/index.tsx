import clsx from "clsx"
import Link from "next/link"
import { Fragment, useCallback, useEffect, useMemo, useState } from "react"
import {
  Configure,
  ConfigureProps,
  Index,
  Snippet,
  useHits,
  useInstantSearch,
} from "react-instantsearch"
import BorderedIcon from "../../BorderedIcon"
import IconDocumentTextSolid from "../../Icons/DocumentTextSolid"
import IconArrowDownLeftMini from "../../Icons/ArrowDownLeftMini"
import SearchNoResult from "../NoResults"

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
  const indices = useMemo(
    () => [
      process.env.NEXT_PUBLIC_API_ALGOLIA_INDEX_NAME || "temp",
      process.env.NEXT_PUBLIC_DOCS_ALGOLIA_INDEX_NAME || "temp",
    ],
    []
  )
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
    <div className="h-[calc(100%-56px)] overflow-auto">
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
    if (status !== "loading") {
      setNoResults(indexName, hits.length === 0)
    }
  }, [hits, status])

  return (
    <div className="overflow-auto">
      {Object.keys(grouped).map((groupName, index) => (
        <Fragment key={index}>
          <span
            className={clsx(
              "py-0.75 z-[5] block px-1.5 uppercase",
              "text-medusa-fg-muted dark:text-medusa-fg-muted-dark",
              "border-medusa-border-base dark:border-medusa-border-base border-b",
              "text-compact-x-small-plus sticky top-0 w-full",
              "bg-medusa-bg-base dark:bg-medusa-bg-base-dark"
            )}
          >
            {groupName}
          </span>
          {grouped[groupName].map((item, index) => (
            <div
              className={clsx(
                "hover:bg-medusa-bg-base-hover dark:hover:bg-medusa-bg-base-hover",
                "border-medusa-border-base dark:border-medusa-border-base relative w-full border-b",
                "group"
              )}
              key={index}
            >
              <div className={clsx("py-0.75 flex items-center gap-1 px-1.5")}>
                <BorderedIcon
                  IconComponent={IconDocumentTextSolid}
                  iconWrapperClassName="p-[6px]"
                />
                <div
                  className={clsx(
                    "flex flex-1 flex-col",
                    "overflow-x-hidden text-ellipsis whitespace-nowrap break-words"
                  )}
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
                          : "lvl1",
                      ]}
                      hit={item}
                    />
                  </span>
                  {item.type !== "lvl1" && (
                    <span className="text-compact-small text-medusa-fg-subtle dark:text-medusa-fg-subtle-dark">
                      <Snippet attribute={"content"} hit={item} />
                    </span>
                  )}
                </div>
                <span
                  className={clsx(
                    "bg-medusa-bg-base dark:bg-medusa-bg-base-dark",
                    "p-0.125 invisible rounded group-hover:!visible",
                    "border-medusa-border-strong dark:border-medusa-border-strong-dark border"
                  )}
                >
                  <IconArrowDownLeftMini iconColorClassName="stroke-medusa-fg-muted dark:stroke-medusa-fg-muted-dark" />
                </span>
              </div>
              <Link
                href={item.url}
                className="absolute top-0 left-0 h-full w-full"
              />
            </div>
          ))}
        </Fragment>
      ))}
    </div>
  )
}

export default SearchHitsWrapper
