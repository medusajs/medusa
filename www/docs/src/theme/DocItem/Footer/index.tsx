import React from "react"
import Footer from "@theme-original/DocItem/Footer"
import type FooterType from "@theme/DocItem/Footer"
import type { WrapperProps } from "@docusaurus/types"
import Feedback from "@site/src/components/Feedback/index"
import { useDoc } from "@docusaurus/theme-common/internal"
import { useThemeConfig } from "@docusaurus/theme-common"
import { ThemeConfig } from "@medusajs/docs"

type Props = WrapperProps<typeof FooterType>

export default function FooterWrapper(props: Props): JSX.Element {
  const { metadata } = useDoc()
  const { footerFeedback = { event: "" } } = useThemeConfig() as ThemeConfig

  return (
    <>
      {!metadata.frontMatter?.hide_footer && (
        <div className="tw-mt-[42px]">
          <Feedback
            {...footerFeedback}
            className="tw-border-0 tw-border-t tw-border-solid tw-border-medusa-border-base dark:tw-border-medusa-border-base-dark"
          />
          <Footer {...props} />
        </div>
      )}
    </>
  )
}
