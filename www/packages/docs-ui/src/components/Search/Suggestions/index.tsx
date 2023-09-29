"use client"

import React from "react"
import clsx from "clsx"
import { useInstantSearch } from "react-instantsearch"
import { SearchHitGroupName } from "../Hits/GroupName"

export type SearchSuggestionType = {
  title: string
  items: string[]
}

export type SearchSuggestionsProps = {
  suggestions: SearchSuggestionType[]
}

export const SearchSuggestions = ({ suggestions }: SearchSuggestionsProps) => {
  const { setIndexUiState } = useInstantSearch()
  return (
    <div className="h-full overflow-auto">
      {suggestions.map((suggestion, index) => (
        <React.Fragment key={index}>
          <SearchHitGroupName name={suggestion.title} />
          {suggestion.items.map((item, itemIndex) => (
            <div
              className={clsx(
                "flex items-center justify-between",
                "cursor-pointer rounded-docs_sm p-docs_0.5",
                "hover:bg-medusa-bg-base-hover",
                "focus:bg-medusa-bg-base-hover",
                "focus:outline-none last:mb-docs_1"
              )}
              onClick={() =>
                setIndexUiState({
                  query: item,
                })
              }
              key={itemIndex}
              tabIndex={itemIndex}
              data-hit
            >
              <span
                className={clsx("text-medusa-fg-base", "text-compact-small")}
              >
                {item}
              </span>
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  )
}
