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
      className={clsx("footer", {
        "footer--dark": style === "dark",
      })}
    >
      <div className="container container-fluid footer-container">
        {(logo || copyright || socialLinks) && (
          <div className="col col--6 social-logo-container">
            <div className="logo-container">
              {logo && <div className="margin-bottom--sm">{logo}</div>}
              {copyright}
            </div>
          </div>
        )}
        <div className="col col--6 row row--justify-end">
          {socialLinks && <SocialLinks links={socialLinks} />}
          {links}
        </div>
      </div>
    </footer>
  )
}
