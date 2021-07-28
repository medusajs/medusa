import React, { useEffect } from "react"
import Prism from "prismjs"
import "prismjs/components/prism-json"
import "../../../../css/prism.css"
import CodeBox from "./code-box"

const JsonContainer = ({ json, header }) => {
  useEffect(() => {
    Prism.highlightAll()
  }, [])

  return json ? (
    <CodeBox header={header}>
      <pre>
        <code className={"language-json"}>{json}</code>
      </pre>
    </CodeBox>
  ) : null
}

export default JsonContainer
