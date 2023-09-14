import React from "react"
import Footer from "@theme-original/DocItem/Footer"
import type FooterType from "@theme/DocItem/Footer"
import type { WrapperProps } from "@docusaurus/types"
import { useDoc } from "@docusaurus/theme-common/internal"
import { useThemeConfig } from "@docusaurus/theme-common"
import { ThemeConfig } from "@medusajs/docs"
import { Feedback, GITHUB_ISSUES_PREFIX } from "docs-ui"
import useIsBrowser from "@docusaurus/useIsBrowser"
import { useLocation } from "@docusaurus/router"

type Props = WrapperProps<typeof FooterType>

export default function FooterWrapper(props: Props): JSX.Element {
  const { metadata } = useDoc()
  const { footerFeedback = { event: "" } } = useThemeConfig() as ThemeConfig
  const isBrowser = useIsBrowser()
  const location = useLocation()

  return (
    <>
      {!metadata.frontMatter?.hide_footer && (
        <div className="mt-[42px]">
          <Feedback
            {...footerFeedback}
            className="border-0 border-t border-solid border-medusa-border-base dark:border-medusa-border-base-dark"
            pathName={isBrowser && location ? location.pathname : ""}
            reportLink={GITHUB_ISSUES_PREFIX}
          />
          <Footer {...props} />
        </div>
      )}
    </>
  )
}
