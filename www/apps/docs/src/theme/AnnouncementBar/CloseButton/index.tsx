import React from "react"
import clsx from "clsx"
import { translate } from "@docusaurus/Translate"
import IconClose from "@theme/Icon/Close"
import type { Props } from "@theme/AnnouncementBar/CloseButton"

export default function AnnouncementBarCloseButton(
  props: Props
): JSX.Element | null {
  return (
    <button
      type="button"
      aria-label={translate({
        id: "theme.AnnouncementBar.closeButtonAriaLabel",
        message: "Close",
        description: "The ARIA label for close button of announcement bar",
      })}
      {...props}
      className={clsx(
        "p-0 leading-[0] self-start opacity-100 hover:opacity-100",
        "bg-transparent border-0 cursor-pointer",
        props.className
      )}
    >
      <IconClose
        width={20}
        height={20}
        strokeWidth={1.5}
        className="!text-medusa-fg-muted"
      />
    </button>
  )
}
