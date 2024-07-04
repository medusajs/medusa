"use client"

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"

export type BaseTabType = {
  label: string
  value: string
}

export type EventData = {
  storageValue: string
}

export type TabProps<T> = {
  tabs: T[]
  group?: string
}

export function useTabs<T extends BaseTabType>({ tabs, group }: TabProps<T>) {
  const [selectedTab, setSelectedTab] = useState<T | null>(null)
  const storageKey = useMemo(() => `tab_${group}`, [group])
  const eventKey = useMemo(() => `tab_${group}_changed`, [group])
  const scrollPosition = useRef<number>(0)

  const changeSelectedTab = (tab: T) => {
    if (tab.value === selectedTab?.value) {
      return
    }
    scrollPosition.current = window.scrollY
    setSelectedTab(tab)
    localStorage.setItem(storageKey, tab.value)
    window.dispatchEvent(
      new CustomEvent<EventData>(eventKey, {
        detail: {
          storageValue: tab.value,
        },
      })
    )
  }

  const findTabItem = useCallback(
    (val: string) => {
      const lowerVal = val.toLowerCase()
      return tabs.find((t) => t.value.toLowerCase() === lowerVal)
    },
    [tabs]
  )

  const handleStorageChange = useCallback(
    (e: CustomEvent<EventData>) => {
      if (e.detail.storageValue !== selectedTab?.value) {
        // check if tab exists
        const tab = findTabItem(e.detail.storageValue)
        if (tab) {
          setSelectedTab(tab)
        }
      }
    },
    [selectedTab, findTabItem]
  ) as EventListener

  useEffect(() => {
    if (!selectedTab) {
      const storedSelectedTabValue = localStorage.getItem(storageKey)
      setSelectedTab(
        storedSelectedTabValue
          ? findTabItem(storedSelectedTabValue) || tabs[0]
          : tabs[0]
      )
    }
  }, [selectedTab, storageKey, tabs, findTabItem])

  useEffect(() => {
    window.addEventListener(eventKey, handleStorageChange)

    return () => {
      window.removeEventListener(eventKey, handleStorageChange)
    }
  }, [handleStorageChange, eventKey])

  useLayoutEffect(() => {
    if (scrollPosition.current && window.scrollY !== scrollPosition.current) {
      window.scrollTo(0, scrollPosition.current)
    }
  }, [selectedTab])

  return { selectedTab, changeSelectedTab }
}
