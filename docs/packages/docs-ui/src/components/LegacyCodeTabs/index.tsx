"use client"

import React, { useCallback, useEffect, useMemo, useRef } from "react"
import clsx from "clsx"
import { CodeBlock, CodeBlockProps, CodeBlockStyle } from "@/components"
import { useTabs, BaseTabType, useScrollPositionBlocker } from "@/hooks"
import { CodeBlockHeader } from "../CodeBlock/Header"
import { useColorMode } from "../../providers"

export type LegacyTabType = {
  code?: CodeBlockProps
  codeBlock?: React.ReactNode
} & BaseTabType

export type LegacyCodeTabsProps = {
  tabs: LegacyTabType[]
  className?: string
  group?: string
  title?: string
  blockStyle?: CodeBlockStyle
}

export const LegacyCodeTabs = ({
  tabs,
  className,
  group = "client",
  title,
  blockStyle = "loud",
}: LegacyCodeTabsProps) => {
  const { colorMode } = useColorMode()
  const { selectedTab, changeSelectedTab } = useTabs<LegacyTabType>({
    tabs,
    group,
  })
  const tabRefs: (HTMLButtonElement | null)[] = useMemo(() => [], [])
  const codeTabSelectorRef = useRef<HTMLSpanElement | null>(null)
  const codeTabsWrapperRef = useRef<HTMLDivElement | null>(null)
  const { blockElementScrollPositionUntilNextRender } =
    useScrollPositionBlocker()

  const changeTabSelectorCoordinates = useCallback(
    (selectedTabElm: HTMLElement) => {
      if (!codeTabSelectorRef?.current || !codeTabsWrapperRef?.current) {
        return
      }
      const selectedTabsCoordinates = selectedTabElm.getBoundingClientRect()
      const tabsWrapperCoordinates =
        codeTabsWrapperRef.current.getBoundingClientRect()
      codeTabSelectorRef.current.style.left = `${
        selectedTabsCoordinates.left - tabsWrapperCoordinates.left
      }px`
      codeTabSelectorRef.current.style.width = `${selectedTabsCoordinates.width}px`
      codeTabSelectorRef.current.style.height = `${selectedTabsCoordinates.height}px`
    },
    []
  )

  useEffect(() => {
    if (codeTabSelectorRef?.current && tabRefs.length) {
      const selectedTabElm = tabRefs.find(
        (tab) => tab?.getAttribute("aria-selected") === "true"
      )
      if (selectedTabElm) {
        changeTabSelectorCoordinates(
          selectedTabElm.parentElement || selectedTabElm
        )
      }
    }
  }, [codeTabSelectorRef, tabRefs, changeTabSelectorCoordinates, selectedTab])

  return (
    <div
      className={clsx(
        "relative my-docs_1 w-full max-w-full overflow-auto",
        className
      )}
      ref={codeTabsWrapperRef}
    >
      <span
        className={clsx(
          "xs:absolute xs:border xs:border-solid",
          "xs:transition-all xs:duration-200 xs:ease-ease xs:top-[13px] xs:rounded-full",
          blockStyle === "loud" && [
            colorMode === "light" &&
              "xs:border-medusa-code-border xs:bg-medusa-code-bg-base",
            colorMode === "dark" &&
              "xs:border-medusa-border-base xs:bg-medusa-bg-component",
          ],
          blockStyle === "subtle" && [
            colorMode === "light" &&
              "xs:border-medusa-border-base xs:bg-medusa-bg-base",
            colorMode === "dark" &&
              "xs:border-medusa-code-border xs:bg-medusa-code-bg-base",
          ]
        )}
        ref={codeTabSelectorRef}
      ></span>
      <CodeBlockHeader title={selectedTab?.code?.title || title}>
        <ul
          className={clsx(
            "!list-none flex gap-docs_0.25 items-center",
            "p-0 mb-0"
          )}
        >
          {tabs.map((tab, index) => (
            <li key={index}>
              <button
                className={clsx(
                  "text-compact-small-plus xs:border-0 py-docs_0.25 px-docs_0.75 relative rounded-full border",
                  (!selectedTab || selectedTab.value !== tab.value) && [
                    "text-medusa-code-text-subtle border-transparent",
                    blockStyle === "loud" && [
                      colorMode === "light" &&
                        "text-medusa-code-text-subtle hover:bg-medusa-code-bg-base",
                      colorMode === "dark" &&
                        "text-medusa-fg-muted hover:bg-medusa-bg-component",
                    ],
                    blockStyle === "subtle" && [
                      colorMode === "light" &&
                        "text-medusa-fg-subtle hover:bg-medusa-bg-base",
                      colorMode === "dark" &&
                        "text-medusa-code-text-subtle hover:bg-medusa-code-bg-base",
                    ],
                  ],
                  selectedTab?.value === tab.value && [
                    "xs:!bg-transparent",
                    blockStyle === "loud" && [
                      colorMode === "light" &&
                        "border-medusa-code-border text-medusa-code-text-base",
                      colorMode === "dark" &&
                        "border-medusa-border-base text-medusa-fg-base",
                    ],
                    blockStyle === "subtle" && [
                      colorMode === "light" &&
                        "xs:border-medusa-border-base text-medusa-code-text-base",
                      colorMode === "dark" &&
                        "xs:border-medusa-code-border text-medusa-code-text-base",
                    ],
                  ]
                )}
                ref={(tabControl) => tabRefs.push(tabControl)}
                onClick={(e) => {
                  blockElementScrollPositionUntilNextRender(
                    e.target as HTMLButtonElement
                  )
                  changeSelectedTab(tab)
                }}
                aria-selected={selectedTab?.value === tab.value}
                role="tab"
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </CodeBlockHeader>
      <>
        {selectedTab?.code && (
          <CodeBlock
            {...selectedTab?.code}
            title={undefined}
            className={clsx(
              "!mt-0 !rounded-t-none",
              selectedTab.code.className
            )}
          />
        )}
        {selectedTab?.codeBlock && <>{selectedTab.codeBlock}</>}
      </>
    </div>
  )
}
