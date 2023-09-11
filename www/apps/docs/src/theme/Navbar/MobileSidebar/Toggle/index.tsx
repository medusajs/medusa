import React from "react"
import { useNavbarMobileSidebar } from "@docusaurus/theme-common/internal"
import { translate } from "@docusaurus/Translate"
import IconSidebar from "../../../Icon/Sidebar"
import IconXMark from "../../../Icon/XMark"

export default function MobileSidebarToggle(): JSX.Element {
  const { toggle, shown } = useNavbarMobileSidebar()
  return (
    <button
      onClick={toggle}
      aria-label={translate({
        id: "theme.docs.sidebar.toggleSidebarButtonAriaLabel",
        message: "Toggle navigation bar",
        description:
          "The ARIA label for hamburger menu button of mobile navigation",
      })}
      aria-expanded={shown}
      className="navbar__toggle !block lg:!hidden clean-btn"
      type="button"
    >
      {!shown && (
        <IconSidebar iconColorClassName="stroke-medusa-fg-muted dark:stroke-medusa-fg-muted-dark" />
      )}
      {shown && (
        <IconXMark iconColorClassName="stroke-medusa-fg-muted dark:stroke-medusa-fg-muted-dark" />
      )}
    </button>
  )
}
