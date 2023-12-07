import React from "react"
import clsx from "clsx"
import { useThemeConfig, usePrismTheme } from "@docusaurus/theme-common"
import {
  parseCodeBlockTitle,
  parseLanguage,
  parseLines,
  containsLineNumbers,
  useCodeWordWrap,
} from "@docusaurus/theme-common/internal"
import { Highlight, type Language } from "prism-react-renderer"
import Line from "@theme/CodeBlock/Line"
import Container from "@theme/CodeBlock/Container"
import type { Props } from "@theme/CodeBlock/Content/String"
import { Tooltip, CopyButton } from "docs-ui"
import useIsBrowser from "@docusaurus/useIsBrowser"
import { ThemeConfig } from "@medusajs/docs"
import { ExclamationCircleSolid, SquareTwoStackSolid } from "@medusajs/icons"

// Prism languages are always lowercase
// We want to fail-safe and allow both "php" and "PHP"
// See https://github.com/facebook/docusaurus/issues/9012
function normalizeLanguage(language: string | undefined): string | undefined {
  return language?.toLowerCase()
}

export default function CodeBlockString({
  children,
  className: blockClassName = "",
  metastring,
  title: titleProp,
  showLineNumbers: showLineNumbersProp,
  language: languageProp,
  noReport = false,
  noCopy = false,
}: Props): JSX.Element {
  const {
    prism: { defaultLanguage, magicComments },
    reportCodeLinkPrefix = "",
  } = useThemeConfig() as ThemeConfig
  const language = normalizeLanguage(
    languageProp ?? parseLanguage(blockClassName) ?? defaultLanguage
  )

  const prismTheme = usePrismTheme()
  const wordWrap = useCodeWordWrap()
  const isBrowser = useIsBrowser()

  // We still parse the metastring in case we want to support more syntax in the
  // future. Note that MDX doesn't strip quotes when parsing metastring:
  // "title=\"xyz\"" => title: "\"xyz\""
  const title = parseCodeBlockTitle(metastring) || titleProp

  const { lineClassNames, code } = parseLines(children, {
    metastring,
    language,
    magicComments,
  })
  const showLineNumbers = showLineNumbersProp ?? containsLineNumbers(metastring)

  return (
    <Container
      as="div"
      className={clsx(
        blockClassName,
        language &&
          !blockClassName.includes(`language-${language}`) &&
          `language-${language}`
      )}
    >
      {title && <div>{title}</div>}
      <div className={clsx("relative rounded-[inherit]")}>
        <Highlight
          theme={prismTheme}
          code={code}
          language={(language ?? "text") as Language}
        >
          {({ className, tokens, getLineProps, getTokenProps }) => (
            <>
              <pre
                tabIndex={0}
                ref={wordWrap.codeBlockRef}
                className={clsx("m-0 p-0", "thin-scrollbar", className)}
              >
                <code
                  className={clsx(
                    "font-[inherit] float-left min-w-full print:whitespace-pre-wrap",
                    showLineNumbers &&
                      tokens.length > 1 &&
                      "table p-1 code-block-numbering",
                    title && "p-1",
                    !title && tokens.length > 1 && "p-1",
                    !title && tokens.length === 1 && "py-0.5 pr-0.5 pl-1"
                  )}
                >
                  {tokens.map((line, i) => (
                    <Line
                      key={i}
                      line={line}
                      getLineProps={getLineProps}
                      getTokenProps={getTokenProps}
                      classNames={lineClassNames[i]}
                      showLineNumbers={showLineNumbers && tokens.length > 1}
                    />
                  ))}
                </code>
              </pre>
              <div
                className={clsx(
                  "flex gap-x-0.125 absolute right-1",
                  tokens.length === 1 && "top-0.25",
                  tokens.length > 1 && "top-1"
                )}
              >
                {!noReport && (
                  <Tooltip text="Report Incorrect Code">
                    <a
                      href={`${reportCodeLinkPrefix}&title=${encodeURIComponent(
                        `Docs(Code Issue): Code Issue in ${
                          isBrowser ? location.pathname : ""
                        }`
                      )}`}
                      target="_blank"
                      className={clsx(
                        "bg-transparent border-none p-0.25 cursor-pointer rounded",
                        "hover:bg-medusa-code-bg-base [&:not(:first-child)]:ml-0.5",
                        "inline-flex justify-center items-center invisible xs:visible"
                      )}
                      rel="noreferrer"
                    >
                      <ExclamationCircleSolid className="text-medusa-code-icon" />
                    </a>
                  </Tooltip>
                )}
                {!noCopy && (
                  <CopyButton
                    buttonClassName={clsx(
                      "flex bg-transparent border-none p-0.25 cursor-pointer rounded"
                    )}
                    text={code}
                  >
                    <SquareTwoStackSolid className="text-medusa-code-icon" />
                  </CopyButton>
                )}
              </div>
            </>
          )}
        </Highlight>
      </div>
    </Container>
  )
}
