import React from "react"
import { useNavbarMobileSidebar } from "@docusaurus/theme-common/internal"
import { translate } from "@docusaurus/Translate"
import NavbarColorModeToggle from "@theme/Navbar/ColorModeToggle"
import IconClose from "@theme/Icon/Close"
import NavbarLogo from "@theme/Navbar/Logo"
import clsx from "clsx"

function CloseButton() {
  const mobileSidebar = useNavbarMobileSidebar()
  return (
    <button
      type="button"
      aria-label={translate({
        id: "theme.docs.sidebar.closeSidebarButtonAriaLabel",
        message: "Close navigation bar",
        description: "The ARIA label for close button of mobile sidebar",
      })}
      className={clsx(
        "bg-transparent border-0 text-inherit cursor-pointer p-0",
        "flex ml-auto"
      )}
      onClick={() => mobileSidebar.toggle()}
    >
      <IconClose color="var(--ifm-color-emphasis-600)" />
    </button>
  )
}

export default function NavbarMobileSidebarHeader(): JSX.Element {
  return (
    <div className="navbar-sidebar__brand">
      <NavbarLogo />
      <NavbarColorModeToggle
        className={clsx(
          "[&>button]:hover:bg-medusa-button-neutral-hover",
          "[&>button]:!rounded"
        )}
      />
      <CloseButton />
    </div>
  )
}
