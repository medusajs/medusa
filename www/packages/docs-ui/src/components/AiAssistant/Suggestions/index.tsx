"use client"

import React from "react"
import { SearchHitGroupName } from "../../Search/Hits/GroupName"
import { SearchSuggestionItem } from "../../Search/Suggestions/Item"
import { useChat } from "@kapaai/react-sdk"
import { Link } from "../../Link"
import { useSiteConfig } from "../../../providers/SiteConfig"
import { useAiAssistant } from "../../../providers/AiAssistant"

type AiAssistantSuggestionsProps = React.AllHTMLAttributes<HTMLDivElement>

export const AiAssistantSuggestions = (props: AiAssistantSuggestionsProps) => {
  const {
    config: { baseUrl },
  } = useSiteConfig()
  const { submitQuery } = useChat()
  const { suggestions, hideAiToolsMessage } = useAiAssistant()

  return (
    <div {...props}>
      {!hideAiToolsMessage && (
        <span className="text-medusa-fg-muted text-compact-small px-docs_0.5 py-docs_0.75 block">
          For assistance in your development, use{" "}
          <Link
            href={`${baseUrl}/learn/introduction/build-with-llms-ai#claude-code-plugins`}
            variant="content"
          >
            Claude Code Plugins
          </Link>{" "}
          or{" "}
          <Link
            href={`${baseUrl}/learn/introduction/build-with-llms-ai#mcp-remote-server`}
            variant="content"
          >
            Medusa MCP server
          </Link>{" "}
          in Cursor, VSCode, etc...
        </span>
      )}
      {suggestions.map((suggestion, index) => (
        <React.Fragment key={index}>
          <SearchHitGroupName name={suggestion.title} />
          {suggestion.items.map((item, itemIndex) => (
            <SearchSuggestionItem
              onClick={() => {
                submitQuery(item)
              }}
              key={itemIndex}
              tabIndex={itemIndex}
            >
              {item}
            </SearchSuggestionItem>
          ))}
        </React.Fragment>
      ))}
    </div>
  )
}
