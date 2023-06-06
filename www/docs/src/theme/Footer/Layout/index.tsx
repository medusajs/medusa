import React from "react"
import clsx from "clsx"
import type { Props } from "@theme/Footer/Layout"
import { useThemeConfig } from "@docusaurus/theme-common"
import { ThemeConfig } from "@medusajs/docs"
import SocialLinks from "@site/src/components/Footer/SocialLinks"

export default function FooterLayout({
  style,
  links,
  logo,
  copyright,
}: Props): JSX.Element {
  const { socialLinks } = useThemeConfig() as ThemeConfig

  return (
    <footer
      className={clsx(
        "footer",
        "tw-border-t tw-border-x-0 tw-border-b-0 tw-border-solid tw-border-medusa-border-base dark:tw-border-medusa-border-base-dark",
        "tw-pt-[108px] tw-pb-4 tw-mt-2",
        {
          "footer--dark": style === "dark",
        }
      )}
    >
      <div
        className={clsx(
          "container container-fluid",
          "tw-flex !tw-px-0",
          "[&_.col]:!tw-px-0",
          "lg:tw-flex-row tw-flex-col",
          "!tw-pt-0"
        )}
      >
        {(logo || copyright || socialLinks) && (
          <div className="col col--6">
            <div className={clsx("lg:tw-mb-0 tw-mb-2")}>
              {logo && <div>{logo}</div>}
              {copyright}
            </div>
          </div>
        )}
        <div
          className={clsx("col col--6 row lg:tw-justify-end tw-justify-start")}
        >
          {socialLinks && <SocialLinks links={socialLinks} />}
          {links}
        </div>
      </div>
    </footer>
  )
}
