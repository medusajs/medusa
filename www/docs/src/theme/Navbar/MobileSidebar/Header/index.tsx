import React from "react"
import { useNavbarMobileSidebar } from "@docusaurus/theme-common/internal"
import NavbarColorModeToggle from "@theme/Navbar/ColorModeToggle"
import IconClose from "@theme/Icon/Close"
import NavbarLogo from "@theme/Navbar/Logo"
import clsx from "clsx"

function CloseButton() {
  const mobileSidebar = useNavbarMobileSidebar()
  return (
    <button
      type="button"
      className={clsx(
        "tw-bg-transparent tw-border-0 tw-text-inherit tw-cursor-pointer tw-p-0",
        "tw-flex tw-ml-auto"
      )}
      onClick={() => mobileSidebar.toggle()}
    >
      <IconClose color="var(--ifm-color-emphasis-600)" />
    </button>
  )
}

export default function NavbarMobileSidebarHeader(): JSX.Element {
  return (
    <div
      className={clsx(
        "tw-items-center tw-shadow-navbar dark:tw-shadow-navbar-dark",
        "tw-flex tw-flex-1 tw-h-navbar tw-py-[12px] tw-px-1.5"
      )}
    >
      <NavbarLogo />
      <NavbarColorModeToggle
        className={clsx(
          "[&>button]:hover:tw-bg-medusa-button-neutral-hover dark:[&>button]:hover:tw-bg-medusa-button-neutral-hover-dark",
          "[&>button]:!tw-rounded"
        )}
      />
      <CloseButton />
    </div>
  )
}
