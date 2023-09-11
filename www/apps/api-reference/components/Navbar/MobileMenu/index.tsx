"use client"

import NavbarMenuButton from "../MenuButton"
import NavbarMobileLogo from "../MobileLogo"
import NavbarColorModeToggle from "../ColorModeToggle"
import SearchModalOpener from "../../Search/ModalOpener"
import { useMobile } from "../../../providers/mobile"

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
            <SearchModalOpener />
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
