declare module "@theme/CodeBlock" {
  import type { Props as DocusaurusProps } from "@theme/CodeBlock"

  export interface Props extends DocusaurusProps {
    readonly noReport?: boolean
    readonly noCopy?: boolean
  }
}

declare module "@theme/CodeBlock/Content/String" {
  import type { Props as CodeBlockProps } from "@theme/CodeBlock"

  export interface Props extends Omit<CodeBlockProps, "children"> {
    readonly children: string
    readonly noReport?: boolean
    readonly noCopy?: boolean
  }

  export default function CodeBlockStringContent(props: Props): JSX.Element
}

declare module "@medusajs/docs" {
  import type { ThemeConfig as DocusaurusThemeConfig } from "@docusaurus/preset-classic"
  import type { DocusaurusConfig } from "@docusaurus/types"
  import type {
    PropSidebarItemCategory,
    PropSidebarItemLink,
    PropSidebarItemHtml,
  } from "@docusaurus/plugin-content-docs"
  import { BadgeProps, ButtonType, ButtonVariants } from "docs-ui"
  import { IconProps } from "@medusajs/icons/dist/types"
  import { DocContextValue as DocusaurusDocContextValue } from "@docusaurus/theme-common/internal"
  import { ReactNode } from "react"
  import { NavbarLogo } from "@docusaurus/theme-common"
  import type { DocusaurusContext } from "@docusaurus/types"

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
      sidebar_is_soon?: boolean
      sidebar_is_group_headline?: boolean
      sidebar_is_group_divider?: boolean
      sidebar_is_divider_line?: boolean
      sidebar_is_back_link?: boolean
      sidebar_badge?: BadgeProps
      category_id?: string
    }
  }

  export declare type ModifiedPropSidebarItemCategory =
    PropSidebarItemCategory & ItemCustomProps

  export declare type ModifiedPropSidebarItemLink = PropSidebarItemLink &
    ItemCustomProps

  export declare type ModifiedPropSidebarItemHtml = PropSidebarItemHtml &
    ItemCustomProps

  export declare type ModifiedSidebarItem =
    | ModifiedPropSidebarItemCategory
    | ModifiedPropSidebarItemLink
    | ModifiedPropSidebarItemHtml

  export declare type ModifiedDocCardBase = {
    type: string
    href: string
    icon: ReactNode | string
    title: string
    description?: string
    html?: string
    containerClassName?: string
    isSoon?: boolean
    badge?: BadgeProps
    children?: React.ReactNode
  }

  export declare type ModifiedDocCardItemLink = {
    type: "link"
  } & ModifiedDocCardBase &
    ModifiedPropSidebarItemLink

  export declare type ModifiedDocCardItemCategory = {
    type: "category"
  } & ModifiedDocCardBase &
    ModifiedPropSidebarItemCategory

  export declare type ModifiedDocCard =
    | ModifiedDocCardItemLink
    | ModifiedDocCardItemCategory

  export declare type SocialLink = {
    href: string
    type: string
  }

  export declare type NavbarActionBase = {
    type: string
    title?: string
    icon?: string
    Icon?: React.ReactElement
    className?: string
    label?: string
    html?: string
  }

  export declare type NavbarActionLink = NavbarActionBase & {
    type: "link"
    href: string
  }

  export declare type NavbarActionButton = NavbarActionBase & {
    type: "button"
    variant?: ButtonVariants
    buttonType?: ButtonType
    href?: string
    events?: {
      onClick?: MouseEventHandler<HTMLButtonElement>
      onMouseEnter?: MouseEventHandler<HTMLButtonElement>
      onMouseLeave?: MouseEventHandler<HTMLButtonElement>
      onMouseOver?: MouseEventHandler<HTMLButtonElement>
    }
  }

  export declare type NavbarAction = NavbarActionLink | NavbarActionButton

  export declare type OptionType = {
    value: string
    label: string
    isAllOption?: boolean
  }

  export declare type ThemeConfig = {
    reportCodeLinkPrefix?: string
    footerFeedback: {
      event: string
    }
    socialLinks?: SocialLink[]
    cloudinaryConfig?: {
      cloudName?: string
      flags?: string[]
      resize?: {
        action: string
        width?: number
        height?: number
        aspectRatio?: string
      }
      roundCorners?: number
    }
    navbarActions: NavbarAction[]
    // resolve type errors
    prism: {
      magicComments: MagicCommentConfig[]
    }
    mobileLogo: NavbarLogo
    algoliaConfig?: {
      apiKey: string
      indexNames: {
        docs: string
        api: string
      }
      appId: string
      filters: OptionType[]
      defaultFilters: string[]
      defaultFiltersByPath: {
        path: string
        filters: string[]
      }[]
    }
    analytics?: {
      apiKey: string
    }
    aiAssistant?: {
      apiUrl: string
      websiteId: string
      recaptchaSiteKey: string
    }
  } & DocusaurusThemeConfig

  export declare type MedusaDocusaurusConfig = {
    themeConfig: ThemeConfig
  } & DocusaurusConfig

  export declare type DocContextValue = {
    frontMatter: {
      addHowToData?: boolean
      badge?: {
        variant: string
        text: string
      }
    }
  } & DocusaurusDocContextValue

  export declare type MedusaDocusaurusContext = DocusaurusContext & {
    siteConfig: MedusaDocusaurusConfig
  }

  export declare type Diagram2Code = {
    diagram: string
    code: string
  }

  export declare type Diagram2CodeSpec = {
    [k: string]: Diagram2Code
  }

  export declare type Diagram2CodeSpecs = {
    [k: string]: Diagram2CodeSpec
  }
}
