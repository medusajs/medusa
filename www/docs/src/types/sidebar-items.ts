import type {
  PropSidebarItemCategory,
  PropSidebarItemLink,
  PropSidebarItemHtml,
} from "@docusaurus/plugin-content-docs"
import { BadgeProps } from "../components/Badge/index"
import { IconProps } from "../theme/Icon/index"

type ItemCustomProps = {
  customProps?: {
    themedImage: {
      light: string
      dark?: string
    }
    image?: string
    icon?: React.FC<IconProps>
    iconName?: string
    description?: string
    className?: string
    isSoon?: boolean
    badge: BadgeProps
    html?: string
    sidebar_icon?: string
    sidebar_is_title?: boolean
  }
}

export type ModifiedPropSidebarItemCategory = PropSidebarItemCategory &
  ItemCustomProps

export type ModifiedPropSidebarItemLink = PropSidebarItemLink & ItemCustomProps

export type ModifiedPropSidebarItemHtml = PropSidebarItemHtml & ItemCustomProps

export type ModifiedSidebarItem =
  | ModifiedPropSidebarItemCategory
  | ModifiedPropSidebarItemLink
  | ModifiedPropSidebarItemHtml
