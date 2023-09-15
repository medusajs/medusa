"use client"

import NavbarMenuButton from "../MenuButton"
import NavbarMobileLogo from "../MobileLogo"
import NavbarColorModeToggle from "../ColorModeToggle"
import NavbarSearchModalOpener from "../SearchModalOpener"
import { useMobile } from "docs-ui"

const MobileMenu = () => {
  const { isMobile } = useMobile()

  return (
    <div className="flex w-full items-center justify-between lg:hidden">
      {isMobile && (
        <>
          <NavbarMenuButton
            buttonProps={{
              className:
                "!border-none !bg-transparent !bg-no-image !shadow-none",
            }}
          />
          <NavbarMobileLogo />
          <div className="flex">
            <NavbarSearchModalOpener />
            <NavbarColorModeToggle
              buttonProps={{
                className:
                  "!border-none !bg-transparent !bg-no-image !shadow-none ml-1",
              }}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default MobileMenu
