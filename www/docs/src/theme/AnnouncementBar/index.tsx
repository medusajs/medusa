import React from "react"
import { useThemeConfig } from "@docusaurus/theme-common"
import { useAnnouncementBar } from "@docusaurus/theme-common/internal"
import AnnouncementBarCloseButton from "@theme/AnnouncementBar/CloseButton"
import AnnouncementBarContent from "@theme/AnnouncementBar/Content"

import Bordered from "@site/src/components/Bordered"
import IconBell from "@site/src/theme/Icon/Bell/index"
import clsx from "clsx"

export default function AnnouncementBar(): JSX.Element | null {
  const { announcementBar } = useThemeConfig()
  const { isActive, close } = useAnnouncementBar()
  if (!isActive) {
    return null
  }
  const { isCloseable, id } = announcementBar!
  return (
    <div
      className={clsx(
        "tw-relative tw-flex tw-items-center tw-h-auto tw-bg-medusa-bg-subtle dark:tw-bg-medusa-bg-base-dark tw-p-[12px]",
        "tw-border tw-border-solid tw-border-medusa-border-base dark:tw-border-medusa-border-base-dark tw-rounded tw-mx-1.5 tw-mb-1",
        "tw-transition-all tw-duration-200 tw-ease-ease",
        "hover:tw-bg-medusa-bg-subtle-hover dark:hover:tw-bg-medusa-bg-base-hover-dark",
        "print:tw-hidden"
      )}
    >
      <Bordered wrapperClassName="tw-mr-[12px]">
        <div
          className={clsx(
            "tw-p-[6px] tw-flex tw-justify-center tw-items-center",
            "tw-bg-announcement-bg tw-bg-cover tw-rounded-sm"
          )}
        >
          <IconBell iconColorClassName="tw-fill-medusa-icon-on-color dark:tw-fill-medusa-icon-on-color-dark" />
        </div>
      </Bordered>
      <AnnouncementBarContent className={clsx("tw-flex-1")} />
      {isCloseable && (
        <AnnouncementBarCloseButton
          onClick={close}
          className={clsx("tw-z-[101] tw-text-right lg:tw-basis-[50px]")}
        />
      )}
      <a
        href={id}
        className={clsx(
          "tw-absolute tw-top-0 tw-left-0 tw-w-full tw-h-full tw-z-[100]"
        )}
      />
    </div>
  )
}
