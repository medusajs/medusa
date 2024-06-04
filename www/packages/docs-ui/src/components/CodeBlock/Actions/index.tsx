"use client"

import clsx from "clsx"
import React, { useMemo } from "react"
import { CodeBlockStyle, Link, Tooltip } from "@/components"
import { ExclamationCircle, PlaySolid } from "@medusajs/icons"
import { useColorMode } from "@/providers"
import { GITHUB_ISSUES_PREFIX } from "@/constants"
import { CodeBlockCopyAction } from "./Copy"

export type CodeBlockActionsProps = {
  source: string
  isSingleLine?: boolean
  inHeader: boolean
  inInnerCode?: boolean
  isCollapsed: boolean
  canShowApiTesting?: boolean
  blockStyle: CodeBlockStyle
  onApiTesting: React.Dispatch<React.SetStateAction<boolean>>
  noReport?: boolean
  noCopy?: boolean
}

export const CodeBlockActions = ({
  source,
  inHeader,
  inInnerCode = false,
  isCollapsed,
  isSingleLine = false,
  canShowApiTesting = false,
  blockStyle,
  onApiTesting,
  noReport = false,
  noCopy = false,
}: CodeBlockActionsProps) => {
  const { colorMode } = useColorMode()
  const iconColor = useMemo(
    () =>
      clsx(
        blockStyle === "loud" && "text-medusa-contrast-fg-secondary",
        blockStyle === "subtle" && [
          colorMode === "light" && "text-medusa-fg-muted",
          colorMode === "dark" && "text-medusa-fg-secondary",
        ]
      ),
    [blockStyle, colorMode]
  )

  return (
    <div
      className={clsx(
        "absolute hidden md:block",
        "xs:rounded xs:absolute xs:right-0 xs:top-0 xs:w-[calc(17%+10px)] xs:h-full",
        !inHeader && [
          inInnerCode &&
            "xs:bg-subtle-code-fade-right-to-left dark:xs:bg-subtle-code-fade-right-to-left-dark",
          !inInnerCode &&
            "xs:bg-base-code-fade-right-to-left dark:xs:bg-base-code-fade-right-to-left-dark",
        ],
        inHeader && "xs:bg-transparent"
      )}
    >
      <div
        className={clsx(
          "md:flex md:justify-end",
          !inHeader && [
            "md:pr-docs_0.5",
            isCollapsed && "md:pt-docs_2.5",
            !isCollapsed && [
              isSingleLine && "md:pt-docs_0.25",
              !isSingleLine && "md:pt-docs_0.5",
            ],
          ],
          inHeader && "md:pr-docs_1 md:pt-docs_0.5"
        )}
      >
        {canShowApiTesting && (
          <Tooltip
            text="Test API"
            tooltipClassName="font-base"
            className={clsx(
              "h-fit",
              !inHeader && "p-[6px]",
              inHeader && "px-[6px] pb-[6px]"
            )}
          >
            <PlaySolid
              className={clsx("cursor-pointer", iconColor)}
              onClick={() => onApiTesting(true)}
            />
          </Tooltip>
        )}
        {!noReport && (
          <Tooltip
            text="Report Issue"
            tooltipClassName="font-base"
            className={clsx(
              "h-fit",
              !inHeader && "p-[6px]",
              inHeader && "px-[6px] pb-[6px]"
            )}
          >
            <Link
              href={`${GITHUB_ISSUES_PREFIX}&title=${encodeURIComponent(
                `Docs(Code Issue): `
              )}`}
              target="_blank"
              className={clsx(
                "bg-transparent border-none cursor-pointer rounded",
                "[&:not(:first-child)]:ml-docs_0.5",
                "inline-flex justify-center items-center invisible xs:visible"
              )}
              rel="noreferrer"
            >
              <ExclamationCircle className={clsx(iconColor)} />
            </Link>
          </Tooltip>
        )}
        {!noCopy && (
          <CodeBlockCopyAction
            source={source}
            inHeader={inHeader}
            iconColor={iconColor}
          />
        )}
      </div>
    </div>
  )
}
