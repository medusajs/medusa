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
    <div className={clsx(className)}>
      <ul className="bg-medusa-code-tabs-bg flex !list-none gap-1 rounded-t py-[12px] px-1">
        {tabs.map((tab, index) => (
          <li key={index}>
            <button
              className={clsx(
                "text-label-small-plus rounded-full py-[4px] px-[12px]",
                selectedTab.value !== tab.value && "text-medusa-code-tab-text",
                selectedTab.value === tab.value &&
                  "text-medusa-code-tab-text-active bg-medusa-code-tab-bg border-medusa-code-tab-border border",
                "hover:bg-medusa-code-tab-hover"
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
            preClassName={clsx(
              "!mt-0 !rounded-t-none",
              selectedTab.code.preClassName
            )}
          />
        )}
        {selectedTab.codeBlock && <>{selectedTab.codeBlock}</>}
      </>
    </div>
  )
}

export default CodeTabs
