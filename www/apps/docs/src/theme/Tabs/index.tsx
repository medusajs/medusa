import React, { ReactElement, cloneElement, useEffect, useRef } from "react"
import clsx from "clsx"
import {
  useScrollPositionBlocker,
  useTabs,
  type TabItemProps,
} from "@docusaurus/theme-common/internal"
import useIsBrowser from "@docusaurus/useIsBrowser"
import type { Props as OldProps } from "@theme/Tabs"
// import styles from "./styles.module.css"

type TabsCustomProps = {
  isCodeTabs?: boolean
  codeTitle?: string
}

type TabListProps = OldProps & ReturnType<typeof useTabs> & TabsCustomProps

function TabList({
  className,
  selectedValue,
  selectValue,
  tabValues,
  isCodeTabs = false,
  codeTitle,
}: TabListProps) {
  const tabRefs: (HTMLLIElement | null)[] = []
  const { blockElementScrollPositionUntilNextRender } =
    useScrollPositionBlocker()
  const codeTabSelectorRef = useRef(null)
  const codeTabsWrapperRef = useRef(null)
  const handleTabChange = (
    event:
      | React.FocusEvent<HTMLLIElement>
      | React.MouseEvent<HTMLLIElement>
      | React.KeyboardEvent<HTMLLIElement>
  ) => {
    const newTab = event.currentTarget
    const newTabIndex = tabRefs.indexOf(newTab)
    const newTabValue = tabValues[newTabIndex]!.value

    if (newTabValue !== selectedValue) {
      blockElementScrollPositionUntilNextRender(newTab)
      selectValue(newTabValue)
    }
  }

  const handleKeydown = (event: React.KeyboardEvent<HTMLLIElement>) => {
    let focusElement: HTMLLIElement | null = null

    switch (event.key) {
      case "Enter": {
        handleTabChange(event)
        break
      }
      case "ArrowRight": {
        const nextTab = tabRefs.indexOf(event.currentTarget) + 1
        focusElement = tabRefs[nextTab] ?? tabRefs[0]!
        break
      }
      case "ArrowLeft": {
        const prevTab = tabRefs.indexOf(event.currentTarget) - 1
        focusElement = tabRefs[prevTab] ?? tabRefs[tabRefs.length - 1]!
        break
      }
      default:
        break
    }

    focusElement?.focus()
  }

  const changeTabSelectorCoordinates = (selectedTab) => {
    if (!codeTabSelectorRef?.current || !codeTabsWrapperRef?.current) {
      return
    }
    const selectedTabsCoordinates = selectedTab.getBoundingClientRect()
    const tabsWrapperCoordinates =
      codeTabsWrapperRef.current.getBoundingClientRect()
    codeTabSelectorRef.current.style.left = `${
      selectedTabsCoordinates.left - tabsWrapperCoordinates.left
    }px`
    codeTabSelectorRef.current.style.width = `${selectedTabsCoordinates.width}px`
    codeTabSelectorRef.current.style.height = `${selectedTabsCoordinates.height}px`
  }

  useEffect(() => {
    if (codeTabSelectorRef?.current && tabRefs.length) {
      const selectedTab = tabRefs.find(
        (tab) => tab.getAttribute("aria-selected") === "true"
      )
      if (selectedTab) {
        changeTabSelectorCoordinates(selectedTab)
      }
    }
  }, [codeTabSelectorRef, tabRefs])

  return (
    <div
      className={clsx(isCodeTabs && "code-header", !isCodeTabs && "[&+*]:pt-2")}
    >
      <div
        className={clsx(isCodeTabs && "relative overflow-auto")}
        ref={codeTabsWrapperRef}
      >
        {isCodeTabs && (
          <span
            className={clsx(
              "xs:absolute xs:border xs:border-solid xs:border-medusa-code-border xs:bg-medusa-code-bg-base xs:transition-all xs:duration-200 xs:ease-ease xs:top-0 xs:z-[1] xs:rounded-full"
            )}
            ref={codeTabSelectorRef}
          ></span>
        )}
        <ul
          role="tablist"
          aria-orientation="horizontal"
          className={clsx(
            "tabs",
            isCodeTabs && "no-scrollbar",
            "list-none",
            className
          )}
        >
          {tabValues.map(({ value, label, attributes }) => (
            <li
              // TODO extract TabListItem
              role="tab"
              tabIndex={selectedValue === value ? 0 : -1}
              aria-selected={selectedValue === value}
              key={value}
              ref={(tabControl) => tabRefs.push(tabControl)}
              onKeyDown={handleKeydown}
              onClick={handleTabChange}
              {...attributes}
              className={clsx(
                isCodeTabs &&
                  "text-compact-small-plus py-0.25 border border-solid border-transparent whitespace-nowrap rounded-full [&:not(:first-child)]:ml-0.25",
                "!mt-0 cursor-pointer",
                attributes?.className,
                isCodeTabs && "z-[2] flex justify-center items-center",
                isCodeTabs &&
                  selectedValue !== value &&
                  "text-medusa-code-text-subtle hover:!bg-medusa-code-bg-base",
                isCodeTabs &&
                  selectedValue === value &&
                  "text-medusa-code-text-base border border-solid border-medusa-code-border bg-medusa-code-bg-base xs:!border-none xs:!bg-transparent",
                !isCodeTabs &&
                  "border-0 border-b-[3px] rounded inline-flex p-1 transition-[background-color] duration-200 ease-ease",
                !isCodeTabs &&
                  selectedValue === value &&
                  "border-solid border-medusa-fg-base rounded-b-none",
                !isCodeTabs &&
                  selectedValue !== value &&
                  "text-medusa-fg-subtle",
                (!isCodeTabs || !attributes?.badge) && "px-0.75",
                isCodeTabs &&
                  attributes?.badge &&
                  "[&_.badge]:ml-0.5 [&_.badge]:py-0.125 [&_.badge]:px-[6px] [&_.badge]:rounded-full pl-0.75 pr-0.25"
              )}
            >
              {label ?? value}
            </li>
          ))}
        </ul>
      </div>
      {isCodeTabs && (
        <span
          className={clsx(
            "text-compact-small-plus text-medusa-code-text-subtle hidden xs:block"
          )}
        >
          {codeTitle}
        </span>
      )}
    </div>
  )
}

function TabContent({
  lazy,
  children,
  selectedValue,
}: OldProps & ReturnType<typeof useTabs>) {
  const childTabs = (Array.isArray(children) ? children : [children]).filter(
    Boolean
  ) as ReactElement<TabItemProps>[]
  if (lazy) {
    const selectedTabItem = childTabs.find(
      (tabItem) => tabItem.props.value === selectedValue
    )
    if (!selectedTabItem) {
      // fail-safe or fail-fast? not sure what's best here
      return null
    }
    return cloneElement(selectedTabItem)
  }
  return (
    <div>
      {childTabs.map((tabItem, i) =>
        cloneElement(tabItem, {
          key: i,
          hidden: tabItem.props.value !== selectedValue,
        })
      )}
    </div>
  )
}

type TabsComponentProp = TabsCustomProps & OldProps

function TabsComponent(props: TabsComponentProp): JSX.Element {
  const tabs = useTabs(props)
  return (
    <div className={clsx("mb-1.5")}>
      <TabList {...props} {...tabs} />
      <TabContent {...props} {...tabs} />
    </div>
  )
}

type TabsProps = {
  wrapperClassName?: string
  isCodeTabs?: boolean
} & OldProps

function checkCodeTabs(props: TabsProps): boolean {
  return props.groupId === "npm2yarn" || props.isCodeTabs
}

export default function Tabs(props: TabsProps): JSX.Element {
  const isBrowser = useIsBrowser()

  useEffect(() => {
    if (!window.localStorage.getItem("docusaurus.tab.npm2yarn")) {
      // set the default
      window.localStorage.setItem("docusaurus.tab.npm2yarn", "yarn")
    }
  }, [])

  const isCodeTabs = checkCodeTabs(props)

  return (
    <div
      className={clsx(
        "tabs-wrapper",
        props.wrapperClassName,
        isCodeTabs && "code-tabs",
        !isCodeTabs &&
          "bg-docs-bg-surface p-1 border border-solid border-medusa-border-base rounded"
      )}
    >
      <TabsComponent
        // Remount tabs after hydration
        // Temporary fix for https://github.com/facebook/docusaurus/issues/5653
        key={String(isBrowser)}
        isCodeTabs={isCodeTabs}
        {...props}
      />
    </div>
  )
}
