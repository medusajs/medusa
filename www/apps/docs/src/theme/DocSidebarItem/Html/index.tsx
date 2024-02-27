import React from "react"
import clsx from "clsx"
import { ThemeClassNames } from "@docusaurus/theme-common"
import type { Props } from "@theme/DocSidebarItem/Html"
import { ModifiedPropSidebarItemHtml } from "@medusajs/docs"
import DocSidebarItemIcon from "../../../components/DocSidebarItemIcon"
import { Badge } from "docs-ui"

type ModifiedProps = Props & {
  item: ModifiedPropSidebarItemHtml
}

export default function DocSidebarItemHtml({
  item,
  level,
  index,
}: ModifiedProps): JSX.Element {
  const { value, defaultStyle, className, customProps } = item

  return (
    <li
      className={clsx(
        ThemeClassNames.docs.docSidebarItemLink,
        ThemeClassNames.docs.docSidebarItemLinkLevel(level),
        defaultStyle && ["lg:py-[6px] lg:px-1", "menu__list-item"],
        className,
        customProps?.sidebar_is_title && "sidebar-title",
        customProps?.sidebar_is_group_headline && "sidebar-group-headline",
        customProps?.sidebar_is_group_divider && "sidebar-group-divider",
        customProps?.sidebar_is_divider_line && "sidebar-divider-line",
        customProps?.sidebar_is_back_link && "sidebar-back-link",
        (customProps?.sidebar_is_soon || customProps?.sidebar_badge) &&
          "sidebar-badge-wrapper",
        customProps?.sidebar_is_soon && "sidebar-soon-link",
        !customProps?.sidebar_is_title &&
          "[&_.sidebar-item-icon]:w-[20px] [&_.sidebar-item-icon]:h-[20px]",
        !customProps?.sidebar_is_title &&
          !customProps?.sidebar_is_back_link &&
          "[&_.sidebar-item-icon]:mr-0.75"
      )}
      key={index}
    >
      {customProps?.sidebar_icon && (
        <DocSidebarItemIcon
          icon={customProps.sidebar_icon}
          is_title={customProps.sidebar_is_title}
          is_disabled={customProps?.sidebar_is_soon}
        />
      )}
      <span
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: value }}
      ></span>
      {customProps?.sidebar_is_soon && (
        <Badge variant="purple" className={`sidebar-soon-badge`}>
          Soon
        </Badge>
      )}
      {customProps?.sidebar_badge && (
        <Badge
          {...customProps.sidebar_badge}
          className={`sidebar-soon-badge`}
        />
      )}
    </li>
  )
}
