"use client"

import React, { Children, useCallback, useEffect, useMemo, useRef } from "react"
import {
  Badge,
  BaseTabType,
  CodeBlockProps,
  CodeBlockStyle,
  useColorMode,
  useTabs,
} from "../.."
import clsx from "clsx"

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
            badgeLabel: undefined,
            hasTabs: true,
            className: clsx("!my-0", codeBlock.props.className),
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

  const bgColor = useMemo(
    () =>
      clsx(
        blockStyle === "loud" && "bg-medusa-contrast-bg-base",
        blockStyle === "subtle" && [
          colorMode === "light" && "bg-medusa-bg-component",
          colorMode === "dark" && "bg-medusa-code-bg-header",
        ]
      ),
    [blockStyle, colorMode]
  )

  const boxShadow = useMemo(
    () =>
      clsx(
        blockStyle === "loud" &&
          "shadow-elevation-code-block dark:shadow-elevation-code-block-dark",
        blockStyle === "subtle" && "shadow-none"
      ),
    [blockStyle]
  )

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
      if (blockStyle !== "loud") {
        codeTabSelectorRef.current.style.height = `${selectedTabsCoordinates.height}px`
      }
    },
    [blockStyle]
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
        "my-docs_1 w-full max-w-full",
        "rounded-docs_lg",
        bgColor,
        boxShadow,
        className
      )}
    >
      <div
        className={clsx(
          "flex gap-docs_0.75 relative",
          "pt-[10px] px-docs_1 pb-px",
          blockStyle === "loud" &&
            selectedTab?.codeProps.title &&
            "border border-solid border-b border-medusa-contrast-border-bot"
        )}
        ref={codeTabsWrapperRef}
      >
        <span
          className={clsx(
            "xs:absolute xs:transition-all xs:duration-200 xs:ease-ease xs:bottom-0",
            blockStyle === "loud" && "bg-medusa-contrast-fg-primary h-px",
            blockStyle === "subtle" && [
              colorMode === "light" &&
                "xs:border-medusa-border-base xs:bg-medusa-bg-base",
              colorMode === "dark" &&
                "xs:border-medusa-code-border xs:bg-medusa-code-bg-base",
            ]
          )}
          ref={codeTabSelectorRef}
        ></span>
        <ul
          className={clsx(
            "!list-none flex gap-docs_0.75 items-center",
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
        {selectedTab?.codeProps.badgeLabel && (
          <Badge variant={selectedTab?.codeProps.badgeColor || "code"}>
            {selectedTab.codeProps.badgeLabel}
          </Badge>
        )}
      </div>
      {selectedTab?.codeBlock}
    </div>
  )
}
