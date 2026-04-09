"use client"

import clsx from "clsx"
import React from "react"
import { Link } from "@/components/Link"
import { Tooltip } from "@/components/Tooltip"
import { ExclamationCircle, PlaySolid } from "@medusajs/icons"
import { GITHUB_ISSUES_LINK } from "@/constants"
import { CodeBlockCopyAction } from "./Copy"
import { CodeBlockAskAiAction } from "./AskAi"
import { useSiteConfig } from "../../../providers/SiteConfig"
import { CodeBlockBloomAction } from "./Bloom"

export type CodeBlockActionsProps = {
  source: string
  isSingleLine?: boolean
  inHeader: boolean
  showGradientBg?: boolean
  inInnerCode?: boolean
  isCollapsed: boolean
  canShowApiTesting?: boolean
  onApiTesting?: React.Dispatch<React.SetStateAction<boolean>>
  noReport?: boolean
  noCopy?: boolean
  noAskAi?: boolean
}

export const CodeBlockActions = ({
  source,
  inHeader,
  showGradientBg = true,
  inInnerCode = false,
  isCollapsed,
  isSingleLine = false,
  canShowApiTesting = false,
  onApiTesting,
  noReport = false,
  noCopy = false,
  noAskAi = false,
}: CodeBlockActionsProps) => {
  const { productView } = useSiteConfig()

  const iconClassName = [
    "text-medusa-contrast-fg-secondary",
    "group-hover:text-medusa-contrast-fg-primary",
    "group-focus:text-medusa-contrast-fg-primary",
  ]

  return (
    <div
      className={clsx(
        "hidden md:block",
        !inHeader &&
          "xs:rounded xs:absolute xs:right-0 xs:top-0 xs:w-[calc(17%+10px)] xs:h-full"
      )}
    >
      {!inHeader && (
        <div
          className={clsx(
            !inHeader &&
              showGradientBg && [
                inInnerCode &&
                  "xs:bg-subtle-code-fade-right-to-left dark:xs:bg-subtle-code-fade-right-to-left-dark",
                !inInnerCode &&
                  "xs:bg-base-code-fade-right-to-left dark:xs:bg-base-code-fade-right-to-left-dark",
              ],
            (inHeader || !showGradientBg) && "xs:bg-transparent",
            "z-[9] w-full h-full absolute top-0 left-0"
          )}
        />
      )}
      <div
        className={clsx(
          "md:flex md:justify-end md:gap-docs_0.25 relative",
          !inHeader && [
            "md:pr-docs_0.5 z-[11]",
            isCollapsed && "md:pt-docs_2.5",
            !isCollapsed && [
              isSingleLine && "md:pt-docs_0.25",
              !isSingleLine && "md:pt-docs_0.5",
            ],
          ]
        )}
      >
        {!noAskAi && (
          <CodeBlockAskAiAction source={source} inHeader={inHeader} />
        )}
        {canShowApiTesting && (
          <Tooltip
            text="Test API"
            tooltipClassName="font-base"
            className={clsx("group")}
            innerClassName={clsx(
              inHeader && "flex",
              "h-fit rounded-docs_sm",
              "group-hover:bg-medusa-contrast-bg-base-hover group-focus:bg-medusa-contrast-bg-base-hover"
            )}
          >
            <span
              className={clsx(
                !inHeader && "p-[6px]",
                inHeader && "p-[4.5px]",
                "cursor-pointer"
              )}
              onClick={() => onApiTesting?.(true)}
            >
              <PlaySolid className={clsx(iconClassName)} />
            </span>
          </Tooltip>
        )}
        {!noReport && (
          <Tooltip
            text="Report Issue"
            tooltipClassName="font-base"
            className={clsx("group")}
            innerClassName={clsx(
              inHeader && "flex",
              "h-fit rounded-docs_sm",
              "group-hover:bg-medusa-contrast-bg-base-hover group-focus:bg-medusa-contrast-bg-base-hover"
            )}
          >
            <Link
              href={GITHUB_ISSUES_LINK}
              target="_blank"
              className={clsx(
                "bg-transparent border-none cursor-pointer rounded",
                "[&:not(:first-child)]:ml-docs_0.5",
                "inline-flex justify-center items-center invisible xs:visible",
                !inHeader && "p-[6px]",
                inHeader && "p-[4.5px]"
              )}
              rel="noreferrer"
            >
              <ExclamationCircle className={clsx(iconClassName)} />
            </Link>
          </Tooltip>
        )}
        {!noCopy && productView !== "bloom" && (
          <CodeBlockCopyAction source={source} inHeader={inHeader} />
        )}
        {productView === "bloom" && (
          <CodeBlockBloomAction source={source} inHeader={inHeader} />
        )}
      </div>
    </div>
  )
}
