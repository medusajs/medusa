import React, { useRef, useEffect } from "react"
import { Box } from "theme-ui"
import "../../prism-medusa-theme/prism.css"
import Prism from "prismjs"
import "prismjs/components/prism-json"
import CodeBox from "./code-box"

const JsonContainer = ({ json, header }) => {
  const jsonRef = useRef()

  //INVESTIGATE: @theme-ui/prism might be a better solution
  useEffect(() => {
    if (jsonRef.current) {
      Prism.highlightAllUnder(jsonRef.current)
    }
  }, [])

  if (typeof json !== "string" || json === "{}") return null

  return (
    <Box ref={jsonRef} sx={{ position: "sticky", top: "20px" }}>
      <CodeBox header={header}>
        <pre>
          <code className={"language-json"}>{json}</code>
        </pre>
      </CodeBox>
    </Box>
  )
}

export default JsonContainer
