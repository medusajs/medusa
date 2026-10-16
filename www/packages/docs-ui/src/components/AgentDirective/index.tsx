import React from "react"

// Hidden from humans and assistive tech; read by AI agents parsing the HTML.
export const AgentDirective = () => {
  return (
    <div className="sr-only" aria-hidden="true">
      For AI agents: a documentation index is available at{" "}
      <a href="/llms.txt" tabIndex={-1}>
        /llms.txt
      </a>
      . Every page is also available as Markdown by appending .md to its URL or
      by requesting it with an Accept: text/markdown header.
    </div>
  )
}
