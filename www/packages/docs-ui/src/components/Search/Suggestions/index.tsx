"use client"

import React from "react"
import { useInstantSearch } from "react-instantsearch"
import { SearchHitGroupName } from "../Hits/GroupName"
import { useSearch } from "@/providers"
import { SearchSuggestionItem } from "./Item"
import { Badge } from "@/components"

export type SearchSuggestionType = {
  title: string
  items: string[]
}

export type SearchSuggestionsProps = {
  suggestions: SearchSuggestionType[]
}

export const SearchSuggestions = ({ suggestions }: SearchSuggestionsProps) => {
  const { setIndexUiState } = useInstantSearch()
  const { commands, setCommand } = useSearch()

  return (
    <div className="h-full overflow-auto">
      {commands.length > 0 && (
        <>
          <SearchHitGroupName name={"Commands"} />
          {commands.map((command, index) => (
            <SearchSuggestionItem
              onClick={() => setCommand(command)}
              key={index}
              tabIndex={index}
              className="justify-between"
            >
              <span className="flex gap-docs_0.75">
                {command.icon}
                <span>{command.title}</span>
              </span>
              {command.badge && <Badge {...command.badge} />}
            </SearchSuggestionItem>
          ))}
        </>
      )}
      {suggestions.map((suggestion, index) => (
        <React.Fragment key={index}>
          <SearchHitGroupName name={suggestion.title} />
          {suggestion.items.map((item, itemIndex) => (
            <SearchSuggestionItem
              onClick={() =>
                setIndexUiState({
                  query: item,
                })
              }
              key={itemIndex}
              tabIndex={commands.length + itemIndex}
            >
              {item}
            </SearchSuggestionItem>
          ))}
        </React.Fragment>
      ))}
    </div>
  )
}
