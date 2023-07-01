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
      className={clsx(
        isCodeTabs && "code-header",
        !isCodeTabs && "[&+*]:tw-pt-2"
      )}
    >
      <div
        className={clsx(isCodeTabs && "tw-relative tw-overflow-auto")}
        ref={codeTabsWrapperRef}
      >
        {isCodeTabs && (
          <span
            className={clsx(
              "xs:tw-absolute xs:tw-border xs:tw-border-solid xs:tw-border-medusa-code-tab-border xs:tw-bg-medusa-code-tab-bg xs:tw-transition-all xs:tw-duration-200 xs:tw-ease-ease xs:tw-top-0 xs:tw-z-[1] xs:tw-rounded-full"
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
            "tw-list-none",
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
                  "tw-text-medusa-code-tab-text tw-text-label-small-plus tw-py-[4px] tw-border tw-border-solid tw-border-transparent tw-whitespace-nowrap tw-rounded-full [&:not(:first-child)]:tw-ml-[4px]",
                "!tw-mt-0 hover:!tw-bg-medusa-code-tab-hover tw-cursor-pointer",
                attributes?.className,
                isCodeTabs &&
                  "tw-z-[2] tw-flex tw-justify-center tw-items-center",
                isCodeTabs &&
                  selectedValue === value &&
                  "tw-text-medusa-code-tab-text-active tw-border tw-border-solid tw-border-medusa-code-tab-border tw-bg-medusa-code-tab-bg xs:tw-border-none xs:tw-bg-transparent",
                !isCodeTabs &&
                  "tw-border-0 tw-border-b-[3px] tw-rounded tw-inline-flex tw-p-1 tw-transition-[background-color] tw-duration-200 tw-ease-ease",
                !isCodeTabs &&
                  selectedValue === value &&
                  "tw-border-solid tw-border-medusa-text-base dark:tw-border-medusa-text-base-dark tw-rounded-b-none",
                !isCodeTabs &&
                  selectedValue !== value &&
                  "tw-text-medusa-text-subtle dark:tw-text-medusa-text-subtle-dark",
                (!isCodeTabs || !attributes?.badge) && "tw-px-[12px]",
                isCodeTabs &&
                  attributes?.badge &&
                  "[&_.badge]:tw-ml-0.5 [&_.badge]:tw-py-[2px] [&_.badge]:tw-px-[6px] [&_.badge]:tw-rounded-full tw-pl-[12px] tw-pr-[4px]"
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
            "tw-text-label-small-plus tw-text-medusa-code-tab-title tw-hidden xs:tw-block"
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
    <div className={clsx("tw-mb-1.5")}>
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
          "tw-bg-docs-bg-surface dark:tw-bg-docs-bg-surface-dark tw-p-1 tw-border tw-border-solid tw-border-medusa-border-base dark:tw-border-medusa-border-base-dark tw-rounded"
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
