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
import Highlight, { defaultProps, type Language } from "prism-react-renderer"
import Line from "@theme/CodeBlock/Line"
import Container from "@theme/CodeBlock/Container"
import type { Props } from "@theme/CodeBlock/Content/String"
import CopyButton from "@site/src/components//CopyButton"
import styles from "./styles.module.css"
import useIsBrowser from "@docusaurus/useIsBrowser"
import { ThemeConfig } from "@medusajs/docs"
import Tooltip from "@site/src/components/Tooltip"
import IconAlert from "@site/src/theme/Icon/Alert"
import IconCopy from "@site/src/theme/Icon/Copy"

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
  const language =
    languageProp ?? parseLanguage(blockClassName) ?? defaultLanguage
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
      {title && <div className={styles.codeBlockTitle}>{title}</div>}
      <div className={styles.codeBlockContent}>
        <Highlight
          {...defaultProps}
          theme={prismTheme}
          code={code}
          language={(language ?? "text") as Language}
        >
          {({ className, tokens, getLineProps, getTokenProps }) => (
            <pre
              tabIndex={0}
              ref={wordWrap.codeBlockRef}
              className={clsx(
                className,
                styles.codeBlock,
                "thin-scrollbar",
                tokens.length === 1 ? styles.thinCodeWrapper : ""
              )}
            >
              <code
                className={clsx(
                  styles.codeBlockLines,
                  showLineNumbers &&
                    tokens.length > 1 &&
                    styles.codeBlockLinesWithNumbering,
                  tokens.length === 1 ? "thin-code" : ""
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
          )}
        </Highlight>
        <div className={styles.buttonGroup}>
          {!noReport && (
            <Tooltip text="Report Incorrect Code">
              <a
                href={`${reportCodeLinkPrefix}&title=${encodeURIComponent(
                  `Docs(Code Issue): Code Issue in ${
                    isBrowser ? location.pathname : ""
                  }`
                )}`}
                target="_blank"
                className="report-code code-action img-url"
                rel="noreferrer"
              >
                <IconAlert />
              </a>
            </Tooltip>
          )}
          {!noCopy && (
            <CopyButton
              buttonClassName="code-action code-action-copy"
              text={code}
            >
              <IconCopy />
            </CopyButton>
          )}
        </div>
      </div>
    </Container>
  )
}
