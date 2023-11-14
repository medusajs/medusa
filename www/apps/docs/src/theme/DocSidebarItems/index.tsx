import React, { memo, useMemo } from "react"
import {
  DocSidebarItemsExpandedStateProvider,
  isActiveSidebarItem,
} from "@docusaurus/theme-common/internal"
import DocSidebarItem from "@theme/DocSidebarItem"
import type { PropSidebarItem } from "@docusaurus/plugin-content-docs"

import type { Props } from "@theme/DocSidebarItems"

function DocSidebarItems({ items, ...props }: Props): JSX.Element {
  // This acts as a fix to a bug in docusaurus which should be part
  // of an upcoming release.
  function isVisibleSidebarItem(
    item: PropSidebarItem,
    activePath: string
  ): boolean {
    switch (item.type) {
      case "category":
        return (
          isActiveSidebarItem(item, activePath) ||
          item.items.some((subItem) =>
            isVisibleSidebarItem(subItem, activePath)
          )
        )
      case "link":
        // An unlisted item remains visible if it is active
        return !item.unlisted || isActiveSidebarItem(item, activePath)
      default:
        return true
    }
  }
  function useVisibleSidebarItems(
    items: readonly PropSidebarItem[],
    activePath: string
  ): PropSidebarItem[] {
    return useMemo(
      () => items.filter((item) => isVisibleSidebarItem(item, activePath)),
      [items, activePath]
    )
  }

  const visibleItems = useVisibleSidebarItems(items, props.activePath)
  return (
    <DocSidebarItemsExpandedStateProvider>
      {visibleItems.map((item, index) => (
        <DocSidebarItem key={index} item={item} index={index} {...props} />
      ))}
    </DocSidebarItemsExpandedStateProvider>
  )
}

// Optimize sidebar at each "level"
export default memo(DocSidebarItems)
