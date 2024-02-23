"use client"

import * as Icons from "@medusajs/icons"
import { Container, Input, Text } from "@medusajs/ui"
import clsx from "clsx"
import { CopyButton } from "docs-ui"
import * as React from "react"

const iconNames = Object.keys(Icons).filter((name) => name !== "default")

const IconSearch = React.memo(function IconSearch() {
  const [query, setQuery] = React.useState<string | undefined>("")

  return (
    <div className="mt-8 flex flex-col gap-y-2">
      <Input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Container>
        <SearchResults query={query} />
      </Container>
    </div>
  )
})

const SearchResults = ({ query = "" }: { query?: string }) => {
  const cleanQuery = escapeStringRegexp(query.trim().replace(/\s/g, " "))
  const results = iconNames.filter((name) =>
    new RegExp(`\\b${cleanQuery}`, "gi").test(name)
  )

  if (results.length === 0) {
    return (
      <div
        className={clsx(
          "text-medusa-text-muted dark:text-medusa-text-muted-dark",
          "flex min-h-[300px] items-center justify-center"
        )}
      >
        <Text>
          No results found for{" "}
          <Text weight={"plus"} asChild>
            <span>{query}</span>
          </Text>
        </Text>
      </div>
    )
  }

  return (
    <div className="grid w-full grid-cols-4 gap-8 md:grid-cols-6 lg:grid-cols-8">
      {results.map((name) => {
        return (
          <div
            key={name}
            className="flex h-full w-full items-center justify-center"
          >
            <CopyButton text={name} tooltipText={name} handleTouch>
              <div
                className={clsx(
                  "border-medusa-border-base",
                  "flex h-10 w-10 items-center justify-center rounded-lg border"
                )}
              >
                <span className="sr-only">Icon named {name}</span>
                <div
                  className={clsx(
                    "bg-medusa-bg-component text-medusa-fg-base",
                    "flex h-8 w-8 items-center justify-center rounded-[4px]"
                  )}
                >
                  {React.createElement(Icons[name as keyof typeof Icons])}
                </div>
              </div>
            </CopyButton>
          </div>
        )
      })}
    </div>
  )
}

// https://github.com/sindresorhus/escape-string-regexp/blob/main/index.js
function escapeStringRegexp(string: unknown) {
  if (typeof string !== "string") {
    throw new TypeError("Expected a string")
  }

  return string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d")
}

export { IconSearch }
