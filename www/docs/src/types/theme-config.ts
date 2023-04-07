import type { ThemeConfig as DocusaurusThemeConfig } from "@docusaurus/theme-common"

export type SocialLink = {
  href: string
  type: string
}

type ThemeConfig = {
  reportCodeLinkPrefix?: string
  footerFeedback: {
    event?: string
  }
  socialLinks: SocialLink[]
} & DocusaurusThemeConfig

export default ThemeConfig
