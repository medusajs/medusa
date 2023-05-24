import React, { type ComponentProps, useEffect, useMemo } from "react"
import clsx from "clsx"
import {
  ThemeClassNames,
  useThemeConfig,
  usePrevious,
  Collapsible,
  useCollapsible,
} from "@docusaurus/theme-common"
import {
  isActiveSidebarItem,
  findFirstCategoryLink,
  useDocSidebarItemsExpandedState,
  isSamePath,
} from "@docusaurus/theme-common/internal"
import Link from "@docusaurus/Link"
import { translate } from "@docusaurus/Translate"
import useIsBrowser from "@docusaurus/useIsBrowser"
import DocSidebarItems from "@theme/DocSidebarItems"
import type { Props } from "@theme/DocSidebarItem/Category"
import Badge from "@site/src/components/Badge/index"
import DocSidebarItemIcon from "@site/src/components/DocSidebarItemIcon"
import { ModifiedPropSidebarItemCategory } from "@medusajs/docs"

type ModifiedProps = Props & {
  item: ModifiedPropSidebarItemCategory
}

// If we navigate to a category and it becomes active, it should automatically
// expand itself
function useAutoExpandActiveCategory({
  isActive,
  collapsed,
  updateCollapsed,
}: {
  isActive: boolean
  collapsed: boolean
  updateCollapsed: (b: boolean) => void
}) {
  const wasActive = usePrevious(isActive)
  useEffect(() => {
    const justBecameActive = isActive && !wasActive
    if (justBecameActive && collapsed) {
      updateCollapsed(false)
    }
  }, [isActive, wasActive, collapsed, updateCollapsed])
}

/**
 * When a collapsible category has no link, we still link it to its first child
 * during SSR as a temporary fallback. This allows to be able to navigate inside
 * the category even when JS fails to load, is delayed or simply disabled
 * React hydration becomes an optional progressive enhancement
 * see https://github.com/facebookincubator/infima/issues/36#issuecomment-772543188
 * see https://github.com/facebook/docusaurus/issues/3030
 */
function useCategoryHrefWithSSRFallback(
  item: Props["item"]
): string | undefined {
  const isBrowser = useIsBrowser()
  return useMemo(() => {
    if (item.href) {
      return item.href
    }
    // In these cases, it's not necessary to render a fallback
    // We skip the "findFirstCategoryLink" computation
    if (isBrowser || !item.collapsible) {
      return undefined
    }
    return findFirstCategoryLink(item)
  }, [item, isBrowser])
}

function CollapseButton({
  categoryLabel,
  onClick,
}: {
  categoryLabel: string
  onClick: ComponentProps<"button">["onClick"]
}) {
  return (
    <button
      aria-label={translate(
        {
          id: "theme.DocSidebarItem.toggleCollapsedCategoryAriaLabel",
          message: "Toggle the collapsible sidebar category '{label}'",
          description:
            "The ARIA label to toggle the collapsible sidebar category",
        },
        { label: categoryLabel }
      )}
      type="button"
      className="tw-hidden"
      onClick={onClick}
    />
  )
}

export default function DocSidebarItemCategory({
  item,
  onItemClick,
  activePath,
  level,
  index,
  ...props
}: ModifiedProps): JSX.Element {
  const { items, label, collapsible, className, href, customProps } = item
  const {
    docs: {
      sidebar: { autoCollapseCategories },
    },
  } = useThemeConfig()
  const hrefWithSSRFallback = useCategoryHrefWithSSRFallback(item)

  const isActive = isActiveSidebarItem(item, activePath)
  const isCurrentPage = isSamePath(href, activePath)

  const { collapsed, setCollapsed } = useCollapsible({
    // Active categories are always initialized as expanded. The default
    // (`item.collapsed`) is only used for non-active categories.
    initialState: () => {
      if (!collapsible) {
        return false
      }
      return isActive ? false : item.collapsed
    },
  })

  const { expandedItem, setExpandedItem } = useDocSidebarItemsExpandedState()
  // Use this instead of `setCollapsed`, because it is also reactive
  const updateCollapsed = (toCollapsed = !collapsed) => {
    setExpandedItem(toCollapsed ? null : index)
    setCollapsed(toCollapsed)
  }
  useAutoExpandActiveCategory({ isActive, collapsed, updateCollapsed })
  useEffect(() => {
    if (
      collapsible &&
      expandedItem != null &&
      expandedItem !== index &&
      autoCollapseCategories
    ) {
      setCollapsed(true)
    }
  }, [collapsible, expandedItem, index, setCollapsed, autoCollapseCategories])

  return (
    <li
      className={clsx(
        ThemeClassNames.docs.docSidebarItemCategory,
        ThemeClassNames.docs.docSidebarItemCategoryLevel(level),
        "menu__list-item",
        // {
        //   "menu__list-item--collapsed": collapsed,
        // },
        className,
        customProps?.sidebar_is_title && "sidebar-title",
        customProps?.sidebar_is_group_headline && "sidebar-group-headline",
        customProps?.sidebar_is_group_divider && "sidebar-group-divider",
        customProps?.sidebar_is_divider_line && "sidebar-divider-line",
        customProps?.sidebar_is_back_link && "sidebar-back-link",
        customProps?.sidebar_is_soon &&
          "sidebar-soon-link sidebar-badge-wrapper",
        !customProps?.sidebar_is_title &&
          "[&_.sidebar-item-icon]:tw-w-[20px] [&_.sidebar-item-icon]:tw-h-[20px]",
        !customProps?.sidebar_is_title &&
          !customProps?.sidebar_is_back_link &&
          "[&_.sidebar-item-icon]:tw-mr-[12px]"
      )}
    >
      <div
        className={clsx("menu__list-item-collapsible", {
          "menu__list-item-collapsible--active": isCurrentPage,
        })}
      >
        <Link
          className={clsx("menu__link", {
            "menu__link--sublist": collapsible,
            "menu__link--sublist-caret": !href && collapsible,
            "menu__link--active": isActive,
          })}
          onClick={
            collapsible
              ? (e) => {
                  onItemClick?.(item)
                  if (href) {
                    updateCollapsed(false)
                  } else {
                    e.preventDefault()
                    updateCollapsed()
                  }
                }
              : () => {
                  onItemClick?.(item)
                }
          }
          aria-current={isCurrentPage ? "page" : undefined}
          aria-expanded={collapsible ? !collapsed : undefined}
          href={collapsible ? hrefWithSSRFallback ?? "#" : hrefWithSSRFallback}
          {...props}
        >
          {customProps?.sidebar_icon && (
            <DocSidebarItemIcon
              icon={customProps.sidebar_icon}
              is_title={customProps.sidebar_is_title}
              is_disabled={customProps?.sidebar_is_soon}
            />
          )}
          {label}
        </Link>
        {href && collapsible && (
          <CollapseButton
            categoryLabel={label}
            onClick={(e) => {
              e.preventDefault()
              updateCollapsed()
            }}
          />
        )}
        {customProps?.sidebar_is_soon && (
          <Badge variant="purple" className={`sidebar-soon-badge`}>
            Soon
          </Badge>
        )}
      </div>

      <Collapsible lazy as="ul" className="menu__list" collapsed={collapsed}>
        <DocSidebarItems
          items={items}
          tabIndex={collapsed ? -1 : 0}
          onItemClick={onItemClick}
          activePath={activePath}
          level={level + 1}
        />
      </Collapsible>
    </li>
  )
}
