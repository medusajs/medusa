import React from "react"
import clsx from "clsx"
import type { Props } from "@theme/Footer/Layout"
import { ThemeConfig } from "@medusajs/docs"
import { useThemeConfig } from "@docusaurus/theme-common"
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
        "border-t border-x-0 border-b-0 border-solid border-medusa-border-base",
        "pt-[108px] pb-4 mt-2",
        {
          "footer--dark": style === "dark",
        }
      )}
    >
      <div
        className={clsx(
          "container container-fluid",
          "flex !px-0",
          "[&_.col]:!px-0",
          "lg:flex-row flex-col",
          "!pt-0"
        )}
      >
        {(logo || copyright || socialLinks) && (
          <div className="col col--6">
            <div className={clsx("lg:mb-0 mb-2")}>
              {logo && <div>{logo}</div>}
              {copyright}
            </div>
          </div>
        )}
        <div className={clsx("col col--6 row lg:justify-end justify-start")}>
          {socialLinks && <SocialLinks links={socialLinks} />}
          {links}
        </div>
      </div>
    </footer>
  )
}
