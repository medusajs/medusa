"use client"

import clsx from "clsx"
import { useState } from "react"
import CodeBlock, { CodeBlockProps } from "../CodeBlock"

type CodeTabsProps = {
  tabs: {
    label: string
    value: string
    code?: CodeBlockProps
    codeBlock?: React.ReactNode
  }[]
  className?: string
}

const CodeTabs = ({ tabs, className }: CodeTabsProps) => {
  const [selectedTab, setSelectedTab] = useState(tabs[0])

  return (
    <div className={clsx("my-1 w-full max-w-full", className)}>
      <ul
        className={clsx(
          "bg-medusa-code-bg-header dark:bg-medusa-code-bg-header-dark flex !list-none rounded-t py-[12px] px-1",
          "dark:border-medusa-code-block-border border border-b-0 border-transparent",
          "mb-0"
        )}
      >
        {tabs.map((tab, index) => (
          <li key={index}>
            <button
              className={clsx(
                "text-label-small-plus rounded-full py-[4px] px-[12px]",
                selectedTab.value !== tab.value && "text-medusa-code-tab-text",
                selectedTab.value === tab.value &&
                  "text-medusa-code-tab-text-active bg-medusa-code-bg-base dark:bg-medusa-code-bg-base-dark",
                selectedTab.value === tab.value &&
                  "border-medusa-code-border dark:border-medusa-code-border-dark border",
                "hover:bg-medusa-code-bg-base dark:hover:bg-medusa-code-bg-base"
              )}
              onClick={() => setSelectedTab(tab)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
      <>
        {selectedTab.code && (
          <CodeBlock
            {...selectedTab.code}
            className={clsx(
              "!mt-0 !rounded-t-none",
              selectedTab.code.className
            )}
          />
        )}
        {selectedTab.codeBlock && <>{selectedTab.codeBlock}</>}
      </>
    </div>
  )
}

export default CodeTabs
