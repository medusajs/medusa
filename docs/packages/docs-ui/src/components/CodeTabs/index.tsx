"use client"

import React, { Children, useCallback, useEffect, useMemo, useRef } from "react"
import {
  BaseTabType,
  CodeBlockProps,
  CodeBlockStyle,
  useColorMode,
  useTabs,
} from "../.."
import clsx from "clsx"
import { CodeBlockHeader } from "../CodeBlock/Header"

type CodeTab = BaseTabType & {
  codeProps: CodeBlockProps
  codeBlock: React.ReactNode
}

type CodeTabProps = {
  children: React.ReactNode
  className?: string
  group?: string
  title?: string
  blockStyle?: CodeBlockStyle
}

export const CodeTabs = ({
  children,
  className,
  group = "client",
  title,
  blockStyle = "loud",
}: CodeTabProps) => {
  const { colorMode } = useColorMode()
  const tabs: CodeTab[] = useMemo(() => {
    const tempTabs: CodeTab[] = []
    Children.forEach(children, (child) => {
      if (
        !React.isValidElement(child) ||
        !child.props.label ||
        !child.props.value ||
        !React.isValidElement(child.props.children)
      ) {
        return
      }

      // extract child code block
      const codeBlock =
        child.props.children.type === "pre" &&
        React.isValidElement(child.props.children.props.children)
          ? child.props.children.props.children
          : child.props.children

      tempTabs.push({
        label: child.props.label,
        value: child.props.value,
        codeProps: codeBlock.props,
        codeBlock: {
          ...codeBlock,
          props: {
            ...codeBlock.props,
            title: undefined,
            className: clsx("!mt-0 !rounded-t-none", codeBlock.props.className),
          },
        },
      })
    })

    return tempTabs
  }, [children])

  const { selectedTab, changeSelectedTab } = useTabs<CodeTab>({
    tabs,
    group,
  })

  const tabRefs: (HTMLButtonElement | null)[] = useMemo(() => [], [])
  const codeTabSelectorRef = useRef<HTMLSpanElement | null>(null)
  const codeTabsWrapperRef = useRef<HTMLDivElement | null>(null)

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
      <CodeBlockHeader title={selectedTab?.codeProps?.title || title}>
        <ul
          className={clsx(
            "!list-none flex gap-docs_0.25 items-center",
            "p-0 mb-0"
          )}
        >
          {Children.map(children, (child, index) => {
            if (!React.isValidElement(child)) {
              return <></>
            }

            return (
              <child.type
                {...child.props}
                changeSelectedTab={changeSelectedTab}
                pushRef={(tabButton: HTMLButtonElement | null) =>
                  tabRefs.push(tabButton)
                }
                blockStyle={blockStyle}
                isSelected={
                  !selectedTab
                    ? index === 0
                    : selectedTab.value === child.props.value
                }
              />
            )
          })}
        </ul>
      </CodeBlockHeader>
      {selectedTab?.codeBlock}
    </div>
  )
}
