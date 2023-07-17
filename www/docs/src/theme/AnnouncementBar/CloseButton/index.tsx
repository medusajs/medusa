import React from "react"
import clsx from "clsx"
import { translate } from "@docusaurus/Translate"
import IconClose from "../../Icon/Close"
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
        "tw-p-0 tw-leading-[0] tw-self-start tw-opacity-100 hover:tw-opacity-100",
        "tw-bg-transparent tw-border-0 tw-cursor-pointer",
        props.className
      )}
    >
      <IconClose
        width={20}
        height={20}
        strokeWidth={1.5}
        iconColorClassName="tw-stroke-medusa-icon-muted dark:tw-stroke-medusa-icon-muted-dark"
      />
    </button>
  )
}
