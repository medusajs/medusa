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
      <IconTwitter iconColorClassName="tw-fill-medusa-icon-placeholder dark:tw-fill-medusa-icon-placeholder-dark group-hover:tw-fill-medusa-icon-secondary dark:group-hover:tw-fill-medusa-icon-secondary-dark" />
    ),
    github: (
      <IconGitHub iconColorClassName="tw-fill-medusa-icon-placeholder dark:tw-fill-medusa-icon-placeholder-dark group-hover:tw-fill-medusa-icon-secondary dark:group-hover:tw-fill-medusa-icon-secondary-dark" />
    ),
    discord: (
      <IconDiscord iconColorClassName="tw-fill-medusa-icon-placeholder dark:tw-fill-medusa-icon-placeholder-dark group-hover:tw-fill-medusa-icon-secondary dark:group-hover:tw-fill-medusa-icon-secondary-dark" />
    ),
    linkedin: (
      <IconLinkedIn iconColorClassName="tw-fill-medusa-icon-placeholder dark:tw-fill-medusa-icon-placeholder-dark group-hover:tw-fill-medusa-icon-secondary dark:group-hover:tw-fill-medusa-icon-secondary-dark" />
    ),
  }

  return (
    <div className="tw-flex tw-items-center">
      {links.map((link) => (
        <a
          className="tw-group tw-ml-1 first:tw-ml-0"
          href={link.href}
          key={link.type}
        >
          {socialIcons[link.type]}
        </a>
      ))}
    </div>
  )
}

export default SocialLinks
