import React from "react"
import IconTwitter from "@site/src/theme/Icon/Twitter"
import IconGitHub from "@site/src/theme/Icon/GitHub"
import IconDiscord from "@site/src/theme/Icon/Discord"
import IconLinkedIn from "@site/src/theme/Icon/LinkedIn"
import { SocialLink } from "@medusajs/docs"

type SocialLinksProps = {
  links?: SocialLink[]
} & React.HTMLAttributes<HTMLDivElement>

const SocialLinks: React.FC<SocialLinksProps> = ({ links = [] }) => {
  const socialIcons = {
    twitter: <IconTwitter />,
    github: <IconGitHub />,
    discord: <IconDiscord />,
    linkedin: <IconLinkedIn />,
  }

  return (
    <div className="social-links">
      {links.map((link) => (
        <a className="social-link" href={link.href} key={link.type}>
          {socialIcons[link.type]}
        </a>
      ))}
    </div>
  )
}

export default SocialLinks
