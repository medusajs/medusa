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
    twitter: (
      <IconTwitter className="!text-ui-fg-muted group-hover:!text-ui-fg-subtle" />
    ),
    github: (
      <IconGitHub className="!text-ui-fg-muted group-hover:!text-ui-fg-subtle" />
    ),
    discord: (
      <IconDiscord className="!text-ui-fg-muted group-hover:!text-ui-fg-subtle" />
    ),
    linkedin: (
      <IconLinkedIn className="!text-ui-fg-muted group-hover:!text-ui-fg-subtle" />
    ),
  }

  return (
    <div className="flex items-center">
      {links.map((link) => (
        <a className="group ml-1 first:ml-0" href={link.href} key={link.type}>
          {socialIcons[link.type]}
        </a>
      ))}
    </div>
  )
}

export default SocialLinks
