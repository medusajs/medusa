"use client"

import React, { Children, useCallback, useEffect, useMemo, useRef } from "react"
import { Badge } from "@/components/Badge"
import { CodeBlockProps, CodeBlockStyle } from "@/components/CodeBlock"
import { useColorMode } from "@/providers/ColorMode"
import clsx from "clsx"
import { CodeBlockActions, CodeBlockActionsProps } from "../CodeBlock/Actions"
import { CodeBlockHeaderWrapper } from "../CodeBlock/Header/Wrapper"
import { BaseTabType, useTabs } from "../../hooks/use-tabs"

type CodeTab = BaseTabType & {
  codeProps: CodeBlockProps
  codeBlock: React.ReactNode
  children?: React.ReactNode
}

type CodeTabProps = {
  children: React.ReactNode
  className?: string
  group?: string
  blockStyle?: CodeBlockStyle
}

export const CodeTabs = ({
  children,
  className,
  group = "client",
  blockStyle = "loud",
}: CodeTabProps) => {
  const { colorMode } = useColorMode()

  const isCodeBlock = (
    node: React.ReactNode
  ): node is
    | React.ReactElement<unknown, string | React.JSXElementConstructor<any>>
    | React.ReactPortal => {
    if (!React.isValidElement(node)) {
      return false
    }

    if (node.type === "pre") {
      return true
    }

    const typedProps = node.props as Record<string, unknown>

    return "source" in typedProps
  }

  const getCodeBlockProps = (
    codeBlock: React.ReactElement<
      unknown,
      string | React.JSXElementConstructor<any>
    >
  ): CodeBlockProps | undefined => {
    if (typeof codeBlock.props !== "object" || !codeBlock.props) {
      return undefined
    }

    if ("source" in codeBlock.props) {
      return codeBlock.props as CodeBlockProps
    }

    if ("children" in codeBlock.props) {
      if (
        typeof codeBlock.props.children === "object" &&
        codeBlock.props.children
      ) {
        return getCodeBlockProps(
          codeBlock.props.children as React.ReactElement<
            unknown,
            string | React.JSXElementConstructor<any>
          >
        )
      } else if (typeof codeBlock.props.children === "string") {
        const lang = "lang" in codeBlock.props ? codeBlock.props.lang : "ts"
        return {
          ...codeBlock.props,
          source: codeBlock.props.children,
          className:
            "className" in codeBlock.props
              ? codeBlock.props.className
              : `language-${lang}`,
        } as CodeBlockProps
      }
    }

    return undefined
  }

  const tabs: CodeTab[] = useMemo(() => {
    const tempTabs: CodeTab[] = []
    Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) {
        return
      }
      const typedChildProps = child.props as CodeTab
      if (
        !typedChildProps.label ||
        !typedChildProps.value ||
        !React.isValidElement(typedChildProps.children)
      ) {
        return
      }

      const codeBlock: React.ReactNode = isCodeBlock(typedChildProps.children)
        ? typedChildProps.children
        : undefined

      if (!codeBlock) {
        return
      }

      let codeBlockProps = codeBlock.props as CodeBlockProps
      const showBadge = !codeBlockProps.title
      const originalBadgeLabel = codeBlockProps.badgeLabel
      const parsedCodeBlockProps = getCodeBlockProps(codeBlock) || {
        source: "",
      }

      const commonProps = {
        badgeLabel: showBadge ? undefined : originalBadgeLabel,
        hasTabs: true,
        className: clsx("!my-0", parsedCodeBlockProps.className),
      }

      if (
        typeof codeBlock.type !== "string" &&
        (("name" in codeBlock.type && codeBlock.type.name === "CodeBlock") ||
          "source" in codeBlockProps)
      ) {
        codeBlockProps = {
          ...codeBlockProps,
          ...commonProps,
        }
      }

      const modifiedProps: CodeBlockProps = {
        ...parsedCodeBlockProps,
        ...commonProps,
      }

      tempTabs.push({
        label: typedChildProps.label,
        value: typedChildProps.value,
        codeProps: {
          ...modifiedProps,
          badgeLabel: !showBadge ? undefined : originalBadgeLabel,
        },
        codeBlock: {
          ...codeBlock,
          props: {
            ...codeBlockProps,
            children: {
              ...(typeof codeBlockProps.children === "object"
                ? codeBlockProps.children
                : {}),
              props: modifiedProps,
            },
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

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
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
    if (codeTabSelectorRef?.current && tabRefs.current.length) {
      const selectedTabElm = tabRefs.current.find(
        (tab) => tab?.getAttribute("aria-selected") === "true"
      )
      if (selectedTabElm) {
        changeTabSelectorCoordinates(
          selectedTabElm.parentElement || selectedTabElm
        )
      }
    }
  }, [codeTabSelectorRef, tabRefs, changeTabSelectorCoordinates, selectedTab])

  const actionsProps: CodeBlockActionsProps | undefined = useMemo(() => {
    if (!selectedTab) {
      return
    }

    return {
      source: selectedTab?.codeProps.source,
      blockStyle,
      noReport: selectedTab?.codeProps.noReport,
      noCopy: selectedTab?.codeProps.noCopy,
      inInnerCode: true,
      showGradientBg: false,
      inHeader: true,
      isCollapsed: false,
    }
  }, [selectedTab])

  // Reset tabRefs array before each render
  tabRefs.current = []

  return (
    <div
      className={clsx(
        "my-docs_1 w-full max-w-full",
        "rounded-docs_lg",
        bgColor,
        boxShadow,
        className
      )}
      data-testid="code-tabs"
    >
      <CodeBlockHeaderWrapper blockStyle={blockStyle} ref={codeTabsWrapperRef}>
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
        <div className="flex gap-docs_1 items-center">
          {selectedTab?.codeProps.badgeLabel && (
            <Badge
              variant={selectedTab?.codeProps.badgeColor || "code"}
              className="!font-base"
            >
              {selectedTab.codeProps.badgeLabel}
            </Badge>
          )}
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
                  {...(typeof child.props === "object" ? child.props : {})}
                  changeSelectedTab={changeSelectedTab}
                  pushRef={(tabButton: HTMLButtonElement | null) =>
                    tabRefs.current.push(tabButton)
                  }
                  blockStyle={blockStyle}
                  isSelected={
                    !selectedTab
                      ? index === 0
                      : selectedTab.value === (child.props as CodeTab).value
                  }
                />
              )
            })}
          </ul>
        </div>
        {actionsProps && <CodeBlockActions {...actionsProps} />}
      </CodeBlockHeaderWrapper>
      {selectedTab?.codeBlock}
    </div>
  )
}
