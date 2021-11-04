import React, { useRef, useEffect } from "react"
import { Box } from "theme-ui"
import "../../medusa-plugin-themes/prism/theme.css"
import Prism from "prismjs"
import "prismjs/components/prism-json"
import CodeBox from "./code-box"

const JsonContainer = ({ json, header, language, allowCopy }) => {
  const jsonRef = useRef()

  const codeClass = language
    ? language === "shell"
      ? "language-shell"
      : "language-json"
    : "language-json"

  //INVESTIGATE: @theme-ui/prism might be a better solution
  useEffect(() => {
    if (jsonRef.current) {
      Prism.highlightAllUnder(jsonRef.current)
    }
  }, [])

  if (typeof json !== "string" || json === "{}") return null

  return (
    <Box ref={jsonRef} sx={{ position: "sticky", top: "20px" }}>
      <CodeBox
        allowCopy={allowCopy}
        content={json}
        shell={language === "shell"}
        header={header}
      >
        <pre>
          <code className={codeClass}>{json}</code>
        </pre>
      </CodeBox>
    </Box>
  )
}

export default JsonContainer
