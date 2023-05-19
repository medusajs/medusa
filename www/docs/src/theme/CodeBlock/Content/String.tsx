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
      {title && <div>{title}</div>}
      <div className={clsx("tw-relative tw-rounded-[inherit]")}>
        <Highlight
          {...defaultProps}
          theme={prismTheme}
          code={code}
          language={(language ?? "text") as Language}
        >
          {({ className, tokens, getLineProps, getTokenProps }) => (
            <>
              <pre
                tabIndex={0}
                ref={wordWrap.codeBlockRef}
                className={clsx("tw-m-0 tw-p-0", "thin-scrollbar", className)}
              >
                <code
                  className={clsx(
                    "tw-font-[inherit] tw-float-left tw-min-w-full print:tw-whitespace-pre-wrap",
                    showLineNumbers &&
                      tokens.length > 1 &&
                      "tw-table tw-p-1 code-block-numbering",
                    title && "tw-p-1",
                    !title && tokens.length > 1 && "tw-p-1",
                    !title &&
                      tokens.length === 1 &&
                      "tw-py-0.5 tw-pr-0.5 tw-pl-1"
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
                  "tw-flex tw-gap-x-[2px] tw-absolute tw-right-1",
                  tokens.length === 1 && "tw-top-[4px]",
                  tokens.length > 1 && "tw-top-1"
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
                        "tw-bg-transparent tw-border-none tw-p-[4px] tw-cursor-pointer tw-rounded",
                        "hover:tw-bg-medusa-code-tab-hover [&:not(:first-child)]:tw-ml-0.5",
                        "tw-inline-flex tw-justify-center tw-items-center tw-invisible xs:tw-visible"
                      )}
                      rel="noreferrer"
                    >
                      <IconAlert iconColorClassName="tw-fill-medusa-code-block-action" />
                    </a>
                  </Tooltip>
                )}
                {!noCopy && (
                  <CopyButton
                    buttonClassName={clsx(
                      "tw-flex tw-bg-transparent tw-border-none tw-p-[4px] tw-cursor-pointer tw-rounded"
                    )}
                    text={code}
                  >
                    <IconCopy iconColorClassName="tw-fill-medusa-code-block-action" />
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
