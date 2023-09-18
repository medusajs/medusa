"use client"

import clsx from "clsx"
import { useCallback, useEffect, useMemo, useRef } from "react"
import CodeBlock, { CodeBlockProps } from "../CodeBlock"
import useTabs, { BaseTabType } from "../../hooks/use-tabs"
import { useScrollPositionBlocker } from "../../hooks/scroll-utils"

type TabType = {
  code?: CodeBlockProps
  codeBlock?: React.ReactNode
} & BaseTabType

type CodeTabsProps = {
  tabs: TabType[]
  className?: string
  group?: string
}

const CodeTabs = ({ tabs, className, group = "client" }: CodeTabsProps) => {
  const { selectedTab, changeSelectedTab } = useTabs<TabType>({
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
        "relative my-1 w-full max-w-full overflow-auto",
        className
      )}
      ref={codeTabsWrapperRef}
    >
      <span
        className={clsx(
          "xs:absolute xs:border xs:border-solid xs:border-ui-code-border xs:bg-ui-code-bg-base ",
          "xs:transition-all xs:duration-200 xs:ease-ease xs:top-[13px] xs:z-[1] xs:rounded-full"
        )}
        ref={codeTabSelectorRef}
      ></span>
      <ul
        className={clsx(
          "bg-ui-code-bg-header py-0.75 flex !list-none rounded-t px-1",
          "border-ui-code-border border border-b-0",
          "gap-0.25 mb-0"
        )}
      >
        {tabs.map((tab, index) => (
          <li key={index}>
            <button
              className={clsx(
                "text-compact-small-plus xs:border-0 py-0.25 px-0.75 relative z-[2] rounded-full border",
                (!selectedTab || selectedTab.value !== tab.value) && [
                  "text-ui-code-text-subtle border-transparent",
                  "hover:bg-ui-code-bg-base",
                ],
                selectedTab?.value === tab.value &&
                  "text-ui-code-text-base bg-ui-code-bg-base xs:!bg-transparent"
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
      <>
        {selectedTab?.code && (
          <CodeBlock
            {...selectedTab?.code}
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

export default CodeTabs
