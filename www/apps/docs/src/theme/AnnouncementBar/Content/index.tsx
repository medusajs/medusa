import React from "react"
import clsx from "clsx"
import { useThemeConfig } from "@docusaurus/theme-common"
import type { Props } from "@theme/AnnouncementBar/Content"

export default function AnnouncementBarContent(
  props: Props
): JSX.Element | null {
  const { announcementBar } = useThemeConfig()
  const { content } = announcementBar!
  return (
    <div
      className={clsx(
        "text-medusa-fg-subtle",
        "text-compact-x-small-plus",
        props.className
      )}
    >
      <div
        {...props}
        className={clsx("text-medusa-fg-base")}
        // Developer provided the HTML, so assume it's safe.
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <span>Read more</span>
    </div>
  )
}
