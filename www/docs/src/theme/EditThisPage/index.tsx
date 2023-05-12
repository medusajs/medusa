import React from "react"
import Translate from "@docusaurus/Translate"
import { ThemeClassNames } from "@docusaurus/theme-common"
import type { Props } from "@theme/EditThisPage"
import clsx from "clsx"

export default function EditThisPage({ editUrl }: Props): JSX.Element {
  return (
    <a
      href={editUrl}
      target="_blank"
      rel="noreferrer noopener"
      className={clsx(
        ThemeClassNames.common.editThisPage,
        "tw-inline-flex tw-flex-row tw-justify-center tw-items-center",
        "tw-py-[6px] tw-px-[12px] tw-rounded tw-cursor-pointer",
        "tw-bg-medusa-button-secondary dark:tw-bg-medusa-button-secondary-dark",
        "hover:tw-bg-medusa-button-secondary-hover dark:hover:tw-bg-medusa-button-secondary-hover-dark hover:tw-no-underline",
        "tw-border tw-border-solid tw-border-medusa-border-base dark:tw-border-medusa-border-base-dark",
        "tw-text-label-small-plus tw-text-medusa-text-base dark:tw-text-medusa-text-base-dark",
        "hover:tw-text-medusa-text-base dark:hover:tw-text-medusa-text-base-dark",
        "focus:tw-shadow-button-focused dark:focus:tw-shadow-button-focused-dark"
      )}
    >
      <Translate
        id="theme.common.editThisPage"
        description="The link label to edit the current page"
      >
        Edit this page
      </Translate>
    </a>
  )
}
