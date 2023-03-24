import type { ThemeConfig as DocusaurusThemeConfig } from "@docusaurus/theme-common"

type ThemeConfig = {
  reportCodeLinkPrefix?: string
  footerFeedback: {
    event?: string
  }
} & DocusaurusThemeConfig

export default ThemeConfig
